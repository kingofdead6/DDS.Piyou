import requests

URL = "http://localhost:5000/api/delivery-areas"

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjBmNjM0NGIzZTg..."
}

# Choose your deliveryCompany and store for all wilayas
DELIVERY_COMPANY = "zr-Express"  # or "zawar"
STORE =  "AB-Zone" #"DDS.Piyou"  # or "AB-Zone" / "Tchingo Mima 2"

data = [
    {"wilaya": "Tissemsilt", "priceHome": 800, "priceDesk": 520},
    {"wilaya": "El Oued", "priceHome": 950, "priceDesk": 600},
    {"wilaya": "Khenchela", "priceHome": 600, "priceDesk": 0},
    {"wilaya": "Souk Ahras", "priceHome": 700, "priceDesk": 450},
    {"wilaya": "Souk El Tenine", "priceHome": 0, "priceDesk": 0},
    {"wilaya": "Tipaza", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Mila", "priceHome": 700, "priceDesk": 450},
    {"wilaya": "Ain Defla", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Naama", "priceHome": 1100, "priceDesk": 600},
    {"wilaya": "Ain Temouchent", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Ghardaia", "priceHome": 950, "priceDesk": 600},
    {"wilaya": "Relizane", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Timimoun", "priceHome": 1400, "priceDesk": 0},
    {"wilaya": "Tindouf", "priceHome": 0, "priceDesk": 0},
    {"wilaya": "Bordj Badji Mokhtar", "priceHome": 0, "priceDesk": 0},
    {"wilaya": "Ouled Djellal", "priceHome": 950, "priceDesk": 500},
    {"wilaya": "Béni Abbès", "priceHome": 1000, "priceDesk": 900},
    {"wilaya": "In Salah", "priceHome": 1600, "priceDesk": 0},
    {"wilaya": "In Guezzam", "priceHome": 1600, "priceDesk": 0},
    {"wilaya": "Touggourt", "priceHome": 950, "priceDesk": 600},
    {"wilaya": "Adrar", "priceHome": 1400, "priceDesk": 900},
    {"wilaya": "Chlef", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Laghouat", "priceHome": 950, "priceDesk": 600},
    {"wilaya": "Oum El Bouaghi", "priceHome": 700, "priceDesk": 450},
    {"wilaya": "Batna", "priceHome": 500, "priceDesk": 300},
    {"wilaya": "Bejaia", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Biskra", "priceHome": 800, "priceDesk": 500},
    {"wilaya": "Bechar", "priceHome": 1100, "priceDesk": 650},
    {"wilaya": "Blida", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Bouira", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Tamanrasset", "priceHome": 1600, "priceDesk": 1050},
    {"wilaya": "Tebessa", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Tlemcen", "priceHome": 950, "priceDesk": 550},
    {"wilaya": "Tiaret", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Tizi Ouzou", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Alger", "priceHome": 600, "priceDesk": 450},
    {"wilaya": "Djelfa", "priceHome": 950, "priceDesk": 600},
    {"wilaya": "Skikda", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Sidi Bel Abbès", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Annaba", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Guelma", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Constantine", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Medea", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Mostaganem", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "M'Sila", "priceHome": 800, "priceDesk": 500},
    {"wilaya": "Mascara", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "Meniaa", "priceHome": 1000, "priceDesk": 0},
    {"wilaya": "Ouargla", "priceHome": 950, "priceDesk": 600},
    {"wilaya": "Oran", "priceHome": 800, "priceDesk": 450},
    {"wilaya": "El Bayadh", "priceHome": 1100, "priceDesk": 600},
    {"wilaya": "Illizi", "priceHome": 0, "priceDesk": 0},
    {"wilaya": "Bordj Bou Arreridj", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Boumerdes", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "El Tarf", "priceHome": 750, "priceDesk": 450},
    {"wilaya": "Saida", "priceHome": 0, "priceDesk": 0},
    {"wilaya": "Djanet", "priceHome": 0, "priceDesk": 0},
    {"wilaya": "M'Ghair" , "priceHome": 950, "priceDesk": 0},
    {"wilaya": "Jijel", "priceHome": 850, "priceDesk": 450},
]

for wilaya in data:
    payload = {
        "wilaya": wilaya["wilaya"],
        "deliveryCompany": DELIVERY_COMPANY,
        "store": STORE,
        "priceHome": wilaya["priceHome"],
        "priceDesk": wilaya["priceDesk"],
        "isActive": True
    }
    res = requests.post(URL, json=payload, headers=HEADERS)
    if res.status_code == 201:
        print(f"{wilaya['wilaya']} added successfully")
    else:
        print(f"Error adding {wilaya['wilaya']}: {res.status_code} - {res.text}")
