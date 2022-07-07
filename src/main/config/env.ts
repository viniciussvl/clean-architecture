export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-architecture-api',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'ok2o3k2232'
}
