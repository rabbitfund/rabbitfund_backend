use fondModels;

db.createCollection("userProposer", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "userProposer",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "proposer": {
                    "bsonType": "objectId"
                },
                "proposer_group": {
                    "bsonType": "string"
                },
                "proposer_create_date": {
                    "bsonType": "date"
                },
                "proposer_update_date": {
                    "bsonType": "date"
                },
                "proposer_cover": {
                    "bsonType": "string"
                },
                "proposer_email": {
                    "bsonType": "string"
                },
                "proposer_phone": {
                    "bsonType": "string"
                },
                "proposer_tax_id": {
                    "bsonType": "number"
                },
                "proposer_intro": {
                    "bsonType": "string"
                },
                "proposer_website": {
                    "bsonType": "string"
                },
                "proposer_like": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "likeProjects": {
                                        "bsonType": "objectId"
                                    }
                                },
                                "additionalProperties": true
                            }
                        }
                    },
                    "additionalProperties": true
                }
            },
            "additionalProperties": true,
            "required": [
                "proposer_group",
                "proposer_email",
                "proposer_tax_id"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});