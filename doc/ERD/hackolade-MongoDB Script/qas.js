use fondModels;

db.createCollection("qas", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "qas",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "qas_parent": {
                    "bsonType": "objectId"
                },
                "qas_q": {
                    "bsonType": "string"
                },
                "qas_a": {
                    "bsonType": "string"
                },
                "qas_create_date": {
                    "bsonType": "date"
                },
                "qas_update_date": {
                    "bsonType": "date"
                },
                "enables": {
                    "bsonType": "bool"
                }
            },
            "additionalProperties": true
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});