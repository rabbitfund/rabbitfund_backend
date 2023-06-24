use fondModels;

db.createCollection("orderInfo", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "orderInfo",
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
                "adress": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "street": {
                                        "bsonType": "string"
                                    },
                                    "city": {
                                        "bsonType": "string"
                                    },
                                    "state": {
                                        "bsonType": "string"
                                    },
                                    "country": {
                                        "bsonType": "string"
                                    },
                                    "postalCode": {
                                        "bsonType": "string"
                                    }
                                },
                                "additionalProperties": true
                            }
                        }
                    },
                    "additionalProperties": true
                },
                "payment_price": {
                    "bsonType": "number"
                },
                "payment_method": {
                    "bsonType": "string",
                    "enum": [
                        "信用卡",
                        "ATM",
                        "信用卡分期"
                    ]
                },
                "payment_note": {
                    "bsonType": "string"
                },
                "payment_service": {
                    "bsonType": "string"
                },
                "payment_status": {
                    "bsonType": "number"
                },
                "invoice_number": {
                    "bsonType": "string"
                },
                "invoice_date": {
                    "bsonType": "date"
                },
                "invoice_type": {
                    "bsonType": "string",
                    "enum": [
                        "紙本發票",
                        "電子載具",
                        "三聯式發票"
                    ]
                },
                "invoice_carrier": {
                    "bsonType": "string"
                },
                "newebpay_tokens": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "aes_encrypt": {
                                        "bsonType": "string"
                                    },
                                    "sha_encrypt": {
                                        "bsonType": "string"
                                    },
                                    "token": {
                                        "bsonType": "string"
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
                "payment_method"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});