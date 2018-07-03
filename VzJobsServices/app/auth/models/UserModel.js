module.exports = {
    fields:{
        id      : {
                    type: "uuid",
                    default: {"$db_function": "uuid()"}
                  },
        name    : "text",
        surname : "text",
        age     : "int",
        email   : "text",
        password: "text",
        created : {
                    type: "timestamp",
                    default: {"$db_function": "toTimestamp(now())"}
                  }
    },
    key:["id"]
}