FROM mongo

COPY addresses.json /addresses.json
CMD mongoimport --host mongodb --db challenge --collection cities --type json --file /addresses.json --jsonArray
