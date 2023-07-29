use fondModels;

db.createCollection("option", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "option",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "option_parent": {
                    "bsonType": "objectId"
                },
                "option_name": {
                    "bsonType": "string"
                },
                "option_price": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "option_total": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "option_content": {
                    "bsonType": "string"
                },
                "option_cover": {
                    "bsonType": "string"
                },
                "option_status": {
                    "bsonType": "number"
                },
                "option_start_date": {
                    "bsonType": "date"
                },
                "option_end_date": {
                    "bsonType": "date"
                },
                "option_create_date": {
                    "bsonType": "date"
                },
                "option_update_date": {
                    "bsonType": "date"
                }
            },
            "additionalProperties": true,
            "required": [
                "option_name",
                "option_price",
                "option_total"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});