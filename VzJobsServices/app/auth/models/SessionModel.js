module.exports = {
    fields:{
        id      : {
                    type: "uuid",
                    default: {"$db_function": "uuid()"}
                  },
        userId  : "text",
        name    : "text",
        exp     : "int",
        token   : "text",
        created : {
                    type: "timestamp",
                    default: {"$db_function": "toTimestamp(now())"}
                  }
    },
    key:["id"]
}