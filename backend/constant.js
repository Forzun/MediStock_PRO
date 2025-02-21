class PUBLIC_DATA{

    static port = process.env.PORT || 4000 
    static mongo_uri = process.env.MONGO_URI1 || `mongodb+srv://vbhavesh219:GLdKNb5gXUsAS351@cluster0.znlw8.mongodb.net/inventory` 
    static jwt_auth = process.env.JWT_AUTH || "21212121"

}

module.exports = {
    PUBLIC_DATA
} 