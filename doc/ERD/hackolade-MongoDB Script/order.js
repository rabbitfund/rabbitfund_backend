use fondModels;

db.createCollection("order", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "order",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "user": {
                    "bsonType": "objectId"
                },
                "ownerInfo": {
                    "bsonType": "objectId"
                },
                "project": {
                    "bsonType": "objectId"
                },
                "option": {
                    "bsonType": "objectId"
                },
                "order_option_quantity": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "order_extra": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "order_total": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "order_note": {
                    "bsonType": "string"
                },
                "order_create_date": {
                    "bsonType": "date"
                },
                "order_status": {
                    "bsonType": "number"
                },
                "order_shipping_status": {
                    "bsonType": "number"
                },
                "order_shipping_date": {
                    "bsonType": "date"
                },
                "order_final_date": {
                    "bsonType": "date"
                },
                "order_feedback": {
                    "bsonType": "string"
                },
                "order_info": {
                    "bsonType": "objectId"
                }
            },
            "additionalProperties": true,
            "required": [
                "order_option_quantity"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});