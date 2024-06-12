var jwt = require('jsonwebtoken');  // jwt 모듈 소환
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req, res) => {
    try {
        let receivedJwt = req.headers["authorization"];
        console.log("우리가 req로 전달받은 jwt", receivedJwt);

        if(receivedJwt) {
            // "Bearer " 부분 제거
            if(receivedJwt.startsWith('Bearer')) {
                receivedJwt = receivedJwt.slice(7, receivedJwt.length).trimLeft();
            }

            var decoded = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            console.log(decoded);
            return decoded;
        } else {
            throw new ReferenceError("jwt must be provided");
        }
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        return err;
    }
}

module.exports = ensureAuthorization;
