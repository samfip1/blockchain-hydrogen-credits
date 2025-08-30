// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// Industry-standard contract for India's Green Hydrogen Subsidy Disbursement
// Aligned with NGHM/SIGHT (mnre.gov.in), using auditor-submitted IPFS hashes
contract IndiaGreenHydrogenSubsidyV4 is Ownable, AccessControl, ReentrancyGuard, Pausable {
    // Role for auditors (empaneled by SECI)
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    // Subsidy types per NGHM
    enum SubsidyType { ProductionPerKg, CapitalPercentage, PLITopUp, SGSTReimbursement }

    // NGHM eligibility criteria
    struct EligibilityCriteria {
        uint256 maxEmissions; // Max CO2e/kg H2 (e.g., 2e18 for 2 kg)
        bool renewableSourceRequired; // Renewable energy
        uint256 minLVA; // Minimum local value addition % (e.g., 30)
        bool equipmentApproved; // Government-approved equipment
    }

    // Subsidy rule
    struct SubsidyRule {
        SubsidyType subsidyType;
        uint256 rate; // e.g., 50e18 wei/kg (₹50/kg)
        uint256 durationYears;
        bool active;
    }

    // Project details
    struct Project {
        address beneficiary; // Producer wallet
        string state; // e.g., "UP" or "" for national
        string scheme; // e.g., "SIGHT-Production"
        uint256 milestoneValue; // Target (kg or ECI in wei)
        uint256 claimedValue; // Producer claim
        uint256 verifiedValue; // Auditor-verified
        uint256 disbursedAmount; // Total paid
        bool achieved; // Milestone met
        bool eligible; // Eligibility status
        string auditorReport; // IPFS hash (e.g., QmHash)
        uint256 createdAt; // Timestamp
    }

    // Mappings
    mapping(string => SubsidyRule) public nationalSchemes;
    mapping(string => mapping(string => SubsidyRule)) public stateSubsidies;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => EligibilityCriteria) public projectEligibilityCriteria;
    mapping(uint256 => bool) public projectDisbursed; // Track disbursement status
    uint256 public projectCount;
    uint256 public ethInrRate; // ETH-INR rate (e.g., 250000e18 wei/INR)

    // Events for audit trails
    event ProjectRegistered(uint256 indexed projectId, address beneficiary, string state, string scheme);
    event EligibilityCriteriaSet(uint256 indexed projectId, uint256 maxEmissions, bool renewableSource, uint256 minLVA);
    event SubsidyRuleUpdated(string state, string scheme, uint256 rate);
    event ClaimSubmitted(uint256 indexed projectId, uint256 claimedValue);
    event EligibilityVerified(uint256 indexed projectId, bool eligible, string ipfsHash);
    event AuditorVerified(uint256 indexed projectId, uint256 verifiedValue, string ipfsHash);
    event SubsidyDisbursed(uint256 indexed projectId, address beneficiary, uint256 amount);
    event PenaltyApplied(uint256 indexed projectId, uint256 penaltyAmount);
    event EthInrRateUpdated(uint256 newRate);

    // Constructor - Fixed for OpenZeppelin v5
    constructor() Ownable(msg.sender) {
        ethInrRate = 250000e18; // 1 ETH = ₹250,000
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // Grant admin role
        _grantRole(AUDITOR_ROLE, msg.sender); // Admin as initial auditor
    }

    // Pause contract
    function pause() external onlyOwner {
        _pause();
    }

    // Unpause contract
    function unpause() external onlyOwner {
        _unpause();
    }

    // Update ETH-INR rate
    function setEthInrRate(uint256 _rate) external onlyOwner {
        require(_rate > 0, "Invalid rate");
        ethInrRate = _rate;
        emit EthInrRateUpdated(_rate);
    }

    // Add auditor
    function addAuditor(address _auditor) external onlyOwner {
        require(_auditor != address(0), "Invalid auditor address");
        _grantRole(AUDITOR_ROLE, _auditor);
    }

    // Remove auditor
    function removeAuditor(address _auditor) external onlyOwner {
        require(_auditor != address(0), "Invalid auditor address");
        _revokeRole(AUDITOR_ROLE, _auditor);
    }

    // Set subsidy rule
    function setSubsidyRule(
        string memory _state,
        string memory _scheme,
        SubsidyType _type,
        uint256 _rate,
        uint256 _duration
    ) external onlyOwner whenNotPaused {
        require(_rate > 0, "Invalid rate");
        require(_duration > 0, "Invalid duration");
        require(bytes(_scheme).length > 0, "Scheme name required");
        
        if (bytes(_state).length == 0) {
            nationalSchemes[_scheme] = SubsidyRule(_type, _rate, _duration, true);
        } else {
            stateSubsidies[_state][_scheme] = SubsidyRule(_type, _rate, _duration, true);
        }
        emit SubsidyRuleUpdated(_state, _scheme, _rate);
    }

    // Register project
    function registerProject(
        address _beneficiary,
        string memory _state,
        string memory _scheme,
        uint256 _milestoneValue,
        uint256 _maxEmissions,
        bool _renewableSourceRequired,
        uint256 _minLVA,
        bool _equipmentApproved
    ) external onlyOwner whenNotPaused {
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_milestoneValue > 0, "Invalid milestone");
        require(_maxEmissions > 0, "Invalid emissions limit");
        require(bytes(_scheme).length > 0, "Scheme name required");
        
        projectCount++;
        projects[projectCount] = Project(
            _beneficiary,
            _state,
            _scheme,
            _milestoneValue,
            0,
            0,
            0,
            false,
            false,
            "",
            block.timestamp
        );
        projectEligibilityCriteria[projectCount] = EligibilityCriteria(
            _maxEmissions,
            _renewableSourceRequired,
            _minLVA,
            _equipmentApproved
        );
        emit ProjectRegistered(projectCount, _beneficiary, _state, _scheme);
        emit EligibilityCriteriaSet(projectCount, _maxEmissions, _renewableSourceRequired, _minLVA);
    }

    // Producer submits claim
    function submitClaim(uint256 _projectId, uint256 _claimedValue) external whenNotPaused {
        require(_projectId <= projectCount && _projectId > 0, "Invalid project ID");
        Project storage proj = projects[_projectId];
        require(msg.sender == proj.beneficiary, "Only beneficiary can submit claim");
        require(proj.eligible, "Project not eligible");
        require(!proj.achieved, "Milestone already achieved");
        require(_claimedValue > 0, "Invalid claim value");
        require(_claimedValue <= proj.milestoneValue, "Claim exceeds milestone");
        
        proj.claimedValue = _claimedValue;
        emit ClaimSubmitted(_projectId, _claimedValue);
    }

    // Auditor verifies eligibility with IPFS hash
    function auditorVerifyEligibility(
        uint256 _projectId,
        uint256 _emissions,
        bool _renewableSource,
        uint256 _lvaPercentage,
        bool _equipmentApproved,
        string memory _ipfsHash
    ) external onlyRole(AUDITOR_ROLE) whenNotPaused {
        require(_projectId <= projectCount && _projectId > 0, "Invalid project ID");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        
        Project storage proj = projects[_projectId];
        EligibilityCriteria memory criteria = projectEligibilityCriteria[_projectId];
        
        bool eligible = _emissions <= criteria.maxEmissions &&
            _renewableSource == criteria.renewableSourceRequired &&
            _lvaPercentage >= criteria.minLVA &&
            _equipmentApproved == criteria.equipmentApproved;
            
        proj.eligible = eligible;
        proj.auditorReport = _ipfsHash; // Store IPFS hash
        
        emit EligibilityVerified(_projectId, eligible, _ipfsHash);
        
        if (!eligible) {
            emit PenaltyApplied(_projectId, 0); // Flag for SECI review
        }
    }

    // Auditor verifies claim with IPFS hash
    function auditorVerify(
        uint256 _projectId,
        uint256 _verifiedValue,
        string memory _ipfsHash
    ) external onlyRole(AUDITOR_ROLE) whenNotPaused {
        require(_projectId <= projectCount && _projectId > 0, "Invalid project ID");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        
        Project storage proj = projects[_projectId];
        require(proj.eligible, "Project not eligible");
        require(proj.claimedValue > 0, "No claim submitted");
        require(_verifiedValue <= proj.claimedValue, "Verified value cannot exceed claim");
        
        proj.verifiedValue = _verifiedValue;
        proj.auditorReport = _ipfsHash; // Store IPFS hash
        
        if (_verifiedValue >= proj.milestoneValue) {
            proj.achieved = true;
        } else {
            // Apply penalty for shortfall
            uint256 penalty = (proj.milestoneValue - _verifiedValue) * 10 / 100;
            emit PenaltyApplied(_projectId, penalty);
        }
        
        emit AuditorVerified(_projectId, _verifiedValue, _ipfsHash);
    }

    // Disburse subsidy - Fixed calculation and logic
    function disburseSubsidy(uint256 _projectId) external onlyOwner nonReentrant whenNotPaused {
        require(_projectId <= projectCount && _projectId > 0, "Invalid project ID");
        Project storage proj = projects[_projectId];
        require(proj.eligible, "Project not eligible");
        require(proj.achieved, "Milestone not achieved");
        require(!projectDisbursed[_projectId], "Already disbursed");
        
        // Get subsidy rule
        SubsidyRule memory rule;
        if (bytes(proj.state).length == 0) {
            rule = nationalSchemes[proj.scheme];
        } else {
            rule = stateSubsidies[proj.state][proj.scheme];
        }
        require(rule.active, "Subsidy rule not active");

        uint256 amount = 0;
        
        if (rule.subsidyType == SubsidyType.ProductionPerKg) {
            // Rate is in INR per kg, convert to ETH
            amount = (rule.rate * proj.verifiedValue) / ethInrRate;
        } else if (rule.subsidyType == SubsidyType.CapitalPercentage) {
            // Rate is percentage of capital expenditure
            amount = (rule.rate * proj.verifiedValue) / (100 * ethInrRate);
        } else if (rule.subsidyType == SubsidyType.PLITopUp) {
            // Rate is percentage for PLI top-up
            amount = (rule.rate * proj.verifiedValue) / (100 * ethInrRate);
        } else if (rule.subsidyType == SubsidyType.SGSTReimbursement) {
            // Rate is percentage for SGST reimbursement
            amount = (rule.rate * proj.verifiedValue) / (100 * ethInrRate);
        }

        require(amount > 0, "Invalid subsidy amount");
        require(address(this).balance >= amount, "Insufficient contract funds");
        
        // Mark as disbursed before transfer to prevent reentrancy
        projectDisbursed[_projectId] = true;
        proj.disbursedAmount += amount;
        
        // Transfer funds
        (bool success, ) = proj.beneficiary.call{value: amount}("");
        require(success, "Disbursement transfer failed");
        
        emit SubsidyDisbursed(_projectId, proj.beneficiary, amount);
    }

    // Batch disburse - Fixed to handle individual failures
    function disburseBatch(uint256[] calldata _projectIds) external onlyOwner nonReentrant whenNotPaused {
        require(_projectIds.length > 0, "Empty project list");
        require(_projectIds.length <= 50, "Too many projects in batch"); // Prevent gas limit issues
        
        for (uint256 i = 0; i < _projectIds.length; i++) {
            uint256 projectId = _projectIds[i];
            
            // Skip invalid or already disbursed projects
            if (projectId == 0 || projectId > projectCount || projectDisbursed[projectId]) {
                continue;
            }
            
            Project storage proj = projects[projectId];
            if (!proj.eligible || !proj.achieved) {
                continue;
            }
            
            // Get subsidy rule
            SubsidyRule memory rule;
            if (bytes(proj.state).length == 0) {
                rule = nationalSchemes[proj.scheme];
            } else {
                rule = stateSubsidies[proj.state][proj.scheme];
            }
            
            if (!rule.active) {
                continue;
            }

            uint256 amount = 0;
            
            if (rule.subsidyType == SubsidyType.ProductionPerKg) {
                amount = (rule.rate * proj.verifiedValue) / ethInrRate;
            } else if (rule.subsidyType == SubsidyType.CapitalPercentage) {
                amount = (rule.rate * proj.verifiedValue) / (100 * ethInrRate);
            } else if (rule.subsidyType == SubsidyType.PLITopUp) {
                amount = (rule.rate * proj.verifiedValue) / (100 * ethInrRate);
            } else if (rule.subsidyType == SubsidyType.SGSTReimbursement) {
                amount = (rule.rate * proj.verifiedValue) / (100 * ethInrRate);
            }

            if (amount > 0 && address(this).balance >= amount) {
                projectDisbursed[projectId] = true;
                proj.disbursedAmount += amount;
                
                (bool success, ) = proj.beneficiary.call{value: amount}("");
                if (success) {
                    emit SubsidyDisbursed(projectId, proj.beneficiary, amount);
                } else {
                    // Revert disbursement status if transfer failed
                    projectDisbursed[projectId] = false;
                    proj.disbursedAmount -= amount;
                }
            }
        }
    }

    // View functions for better frontend integration
    function getProject(uint256 _projectId) external view returns (Project memory) {
        require(_projectId <= projectCount && _projectId > 0, "Invalid project ID");
        return projects[_projectId];
    }

    function getEligibilityCriteria(uint256 _projectId) external view returns (EligibilityCriteria memory) {
        require(_projectId <= projectCount && _projectId > 0, "Invalid project ID");
        return projectEligibilityCriteria[_projectId];
    }

    function getNationalScheme(string memory _scheme) external view returns (SubsidyRule memory) {
        return nationalSchemes[_scheme];
    }

    function getStateSubsidy(string memory _state, string memory _scheme) external view returns (SubsidyRule memory) {
        return stateSubsidies[_state][_scheme];
    }

    function isProjectDisbursed(uint256 _projectId) external view returns (bool) {
        return projectDisbursed[_projectId];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Emergency withdrawal function
    function emergencyWithdraw() external onlyOwner {
        require(paused(), "Contract must be paused");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }

    // Deactivate subsidy rule
    function deactivateSubsidyRule(string memory _state, string memory _scheme) external onlyOwner {
        if (bytes(_state).length == 0) {
            nationalSchemes[_scheme].active = false;
        } else {
            stateSubsidies[_state][_scheme].active = false;
        }
        emit SubsidyRuleUpdated(_state, _scheme, 0);
    }

    // Fund contract
    receive() external payable {
        require(msg.value > 0, "No ETH sent");
    }

    // Fallback function
    fallback() external payable {
        revert("Function not found");
    }
}