const express = require("express")
const Authentication = require("../middlewares/Authentication");
const ConsumerController = require("../controllers/Consumer.controller");
const ConsumerValidation = require("../validations/Consumer.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

router.post("/register", 
    ConsumerValidation.RegisterConsumer,
    Validation,
    Authentication,
    ConsumerController.RegisterConsumer
);

router.get("/get-all", Authentication, ConsumerValidation.query_page, Validation, ConsumerController.GetAllUser)
router.get("/get-search", Authentication, ConsumerController.GetUserForSearch)
router.delete("/delete/:id", Authentication, ConsumerValidation.Params_id, Validation, ConsumerController.DeleteConsumer)

router.route("/dashboard")
.get(Authentication, ConsumerController.DashboardData)
;

router.get("/get/:id", Authentication, ConsumerValidation.Params_id, Validation, ConsumerController.getById)
router.patch("/update/:id", Authentication, ConsumerValidation.RegisterConsumer, Validation, ConsumerController.updateById)

module.exports = router