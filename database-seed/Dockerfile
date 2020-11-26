FROM mongo

COPY addresses.json /addresses.json
CMD mongoimport --host mongodb --db challenge --collection Address --type json --file /addresses.json --jsonArray
