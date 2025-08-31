import React from 'react';
import Card from './Card';

const SubmitClaimCard = () => (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit New Subsidy Claim</h3>
        <form className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-600">Credit Amount (kg H₂)</label>
                <input type="number" placeholder="e.g., 50000" className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-600">Supporting Documents</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                </div>
            </div>
            <div>
                <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                    Submit Claim
                </button>
            </div>
        </form>
    </Card>
);

export default SubmitClaimCard;
