import json
import random
import csv
from datetime import datetime, timedelta

def generate_production_data(start_time, end_time, frequency="6h"):
    data = []
    milestone = 1
    current_time = start_time

    delta = timedelta(hours=6)  # step size

    while current_time < end_time:
        h2_production = round(random.uniform(10000.0, 20000.0), 2)  # hydrogen produced in 6h
        energy_factor = round(random.uniform(35, 45), 2)
        energy_used = round(h2_production * energy_factor, 2)       # energy consumed
        carbon_produced = round(energy_used * 0.0005, 2)            # assume 0.05% emissions

        from_time = current_time
        to_time = from_time + delta

        data.append({
            "milestone": milestone,
            "productionFrom": from_time.strftime("%Y-%m-%d %H:%M:%S"),
            "productionTo": to_time.strftime("%Y-%m-%d %H:%M:%S"),
            "hydrogenProduced": h2_production,
            "carbonProduced": carbon_produced,
            "energyConsumed": energy_used
        })

        current_time = to_time
        milestone += 1

    return data

def create_dummy_database(num_producers, frequency="6h"):
    database = []
    end_time = datetime.now().replace(minute=0, second=0, microsecond=0)
    start_time = end_time - timedelta(days=365)

    for pid in range(1, num_producers + 1):
        print(f"Generating data for producer {pid}...")
        production_data = generate_production_data(start_time, end_time, frequency)
        database.append({
            "planId": pid,
            "productionData": production_data
        })
    return database

def save_to_json(data, filename="dummydata.json"):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)
    print(f"JSON data saved to {filename}")

def save_to_csv(data, filename="dummydata.csv"):
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["planId", "milestone", "productionFrom", "productionTo", 
                         "hydrogenProduced", "carbonProduced", "energyConsumed"])
        
        for plant in data:
            planId = plant["planId"]
            for record in plant["productionData"]:
                writer.writerow([
                    planId,
                    record["milestone"],
                    record["productionFrom"],
                    record["productionTo"],
                    record["hydrogenProduced"],
                    record["carbonProduced"],
                    record["energyConsumed"]
                ])
    print(f"CSV data saved to {filename}")

try:
    data = create_dummy_database(10, frequency="6h")  # 10 producers × 1460 rows each
    save_to_json(data, "dummydata.json")
    save_to_csv(data, "dummydata.csv")
    print("Dummy data generated successfully.")
except IOError:
    print("Error in opening the file!!")
