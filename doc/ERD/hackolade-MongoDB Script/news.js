use fondModels;

db.createCollection("news", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "news",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "news_parent": {
                    "bsonType": "objectId"
                },
                "news_title": {
                    "bsonType": "string"
                },
                "news_content": {
                    "bsonType": "string"
                },
                "news_cover": {
                    "bsonType": "string"
                },
                "news_status": {
                    "bsonType": "number"
                },
                "news_start_date": {
                    "bsonType": "date"
                },
                "news_end_date": {
                    "bsonType": "date"
                },
                "news_create_date": {
                    "bsonType": "date"
                },
                "news_update_date": {
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