const router = require('./server')
const port = 3000

router.listen(port, () => {
    console.log("application live on : " + port)

})
