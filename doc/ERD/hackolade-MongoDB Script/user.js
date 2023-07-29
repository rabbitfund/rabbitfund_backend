use fondModels;

db.createCollection("user", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "user",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "user_name": {
                    "bsonType": "string"
                },
                "user_hash_pwd": {
                    "bsonType": "string"
                },
                "user_email": {
                    "bsonType": "string"
                },
                "user_role": {
                    "bsonType": "number"
                },
                "is_proposer": {
                    "bsonType": "bool"
                },
                "oauth": {
                    "bsonType": "string"
                },
                "tokens": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "access_token": {
                                        "bsonType": "string"
                                    },
                                    "refresh_token": {
                                        "bsonType": "string"
                                    },
                                    "jwt": {
                                        "bsonType": "string"
                                    }
                                },
                                "additionalProperties": true
                            }
                        }
                    },
                    "additionalProperties": true
                },
                "is_verified": {
                    "bsonType": "bool"
                },
                "user_create_date": {
                    "bsonType": "date"
                },
                "user_update_date": {
                    "bsonType": "date"
                },
                "user_cover": {
                    "bsonType": "string"
                },
                "user_phone": {
                    "bsonType": "string"
                },
                "user_intro": {
                    "bsonType": "string"
                },
                "user_website": {
                    "bsonType": "string"
                },
                "user_interests": {
                    "bsonType": "array",
                    "additionalItems": true
                },
                "user_like": {
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
                "user_name",
                "user_hash_pwd",
                "user_email"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});