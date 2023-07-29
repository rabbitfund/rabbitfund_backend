use fondModels;

db.createCollection("project", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "project",
            "properties": {
                "12222": {
                    "bsonType": "objectId"
                },
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "project_title": {
                    "bsonType": "string"
                },
                "project_summary": {
                    "bsonType": "string"
                },
                "project_content": {
                    "bsonType": "string"
                },
                "project_category": {
                    "bsonType": "number"
                },
                "project_target": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "project_progress": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "project_status": {
                    "bsonType": "number"
                },
                "project_start_date": {
                    "bsonType": "date"
                },
                "project_end_date": {
                    "bsonType": "date"
                },
                "project_create_date": {
                    "bsonType": "date"
                },
                "project_update_date": {
                    "bsonType": "date"
                },
                "project_cover": {
                    "bsonType": "string"
                },
                "project_video": {
                    "bsonType": "string"
                },
                "project_risks": {
                    "bsonType": "string"
                },
                "project_thanks": {
                    "bsonType": "string"
                },
                "ownerInfo": {
                    "bsonType": "objectId"
                },
                "option": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "option": {
                                        "bsonType": "objectId"
                                    }
                                },
                                "additionalProperties": true
                            }
                        }
                    },
                    "additionalProperties": true
                },
                "news": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "news": {
                                        "bsonType": "objectId"
                                    }
                                },
                                "additionalProperties": true
                            }
                        }
                    },
                    "additionalProperties": true
                },
                "qas": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "qas": {
                                        "bsonType": "objectId"
                                    }
                                },
                                "additionalProperties": true
                            }
                        }
                    },
                    "additionalProperties": true
                },
                "order": {
                    "bsonType": "object",
                    "properties": {
                        "type": {
                            "bsonType": "array",
                            "additionalItems": true,
                            "items": {
                                "bsonType": "object",
                                "properties": {
                                    "order": {
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
                "project_title",
                "project_category",
                "project_target",
                "project_progress",
                "project_cover"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});