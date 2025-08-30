import json
import random

def generate_production_data(n):
    data = []
    for _ in range(n):
        h2_production = round(random.uniform(40.0, 60.0), 2)
        energy_factor = round(random.uniform(35, 45), 2)
        energy_used = round(h2_production * energy_factor)
        data.append({
            "h2_production": h2_production,
            "energy_used": energy_used
        })
    return data

def create_dummy_database(num_producers, records_per_producer):
    database = []
    for pid in range(1, num_producers + 1):
        
        database.append({
            "planId": pid,
            "productionData": generate_production_data(records_per_producer)
        })
    # print(data)
    return database

try:
    data = create_dummy_database(19, 500)
    with open("dummydata.json", 'w') as file:
        print("here")
        json.dump(data, file, indent=4)
    print("Dummy data generated.")
except IOError:
    print("Error in opening the file!!")
