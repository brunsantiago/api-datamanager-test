const Router = require("express").Router;

const {
  getAllUsers,
  getUserProfile,
  userRegister,
  userLogin,
  userRecoveryKey,
  deleteUser,
  setLastSession,
  getLastSession,
  closeLastSession,
  setHoraEgresoVigilador,
  addPuestoVigilador,
  getPersonal,
  getClientes,
  getCliente,
  getAllObjetivos,
  getObjetivos,
  requestCoordinate,
  getCounter,
  incrementCounter,
  decrementCounter,
  getDevice,
  addDevice,
  getAllDevices,
  deleteDevice,
  updateDevice,
  addRequestDevice,
  getRequestDevices,
  countPending,
  statusAdded,
  deleteRequestDevice,
  deleteAllRequestDevice,
  getPuestos,
  getLastVersion,
  getClientesBrouclean,
  addRequestDeviceBrouclean,
//  getPersonalBrouclean,
  userRegisterBrouclean,
  userLoginBrouclean,
  getUserProfileBrouclean,
  getAllDevicesBrouclean,
  addPuestoBrouclean,
  setLastSessionBrouclean,
  getLastSessionBrouclean,
  closeLastSessionBrouclean,
  setHoraEgresoBrouclean,
//  getLastVersionBrouclean,
  userRecoveryKeyBrouclean,
  getAllUsersBrouclean,
  deleteUserBrouclean,
  countPendingBrouclean,
  getRequestDevicesBrouclean,
  addDeviceBrouclean,
  statusAddedBrouclean,
  deleteRequestDeviceBrouclean,
  deleteAllRequestDeviceBrouclean,
  getClienteBrouclean,
  deleteDeviceBrouclean,
  updateDeviceBrouclean,
  updateVersionDevice
  } = require("../controllers/employees.controller.js");


const router = Router();

// TABLE USERS

// GET Obtener todos los usuarios
router.get("/users", getAllUsers);

// GET Obtener perfil de usuario
router.get("/users/:persCodi/:idEmpresa", getUserProfile);

//POST Registro de usuario
router.post("/register/:idEmpresa", userRegister);

//POST Login de usuario
router.post("/login/:idEmpresa", userLogin);

//PATCH User Key
router.patch("/recovery_key/:idEmpresa", userRecoveryKey);

//DELETE User
router.delete("/users/:userCodi", deleteUser );


// TABLE LAST SESION

// POST Cargar Ultima Sesion
router.post("/last_session/:idEmpresa", setLastSession);

// GET Cargar Ultima Sesion
router.get("/last_session/:persCodi/:idEmpresa", getLastSession);

// PATCH Cerrar Ultima Sesion
router.patch("/last_session/:persCodi/:idEmpresa", closeLastSession);


// TABLE ASIGVIGI

// PATCH Cargar Hora Egreso Empleado
router.patch("/asigvigi/:asigId", setHoraEgresoVigilador)

// POST Cargar Hora Ingreso Empleado
router.post("/asigvigi", addPuestoVigilador);

// TABLE PERSONAL

// GET Personal
router.get("/personal/:nroLegajo/:idEmpresa", getPersonal);


// TABLE OBJETIVO (CLIENTES)

// GET all Clientes
router.get("/clientes/:idEmpresa", getClientes);

// GET Cliente (Activo - SAB-5)
router.get("/clientes/:nombreCliente/:idEmpresa", getCliente);

// TABLE PUESGRUP (OBJETIVOS)

// GET all Objetivos
router.get("/objetivos", getAllObjetivos);

// GET Objetivos from Cliente
router.get("/objetivos/:idCliente", getObjetivos)

// GET Coordinadas from Objetivo
router.get("/objetivos/coordinate/:idObjetivo", requestCoordinate)


// TABLE DEVICE

//GET Device
router.get("/devices/:androidID/:idEmpresa", getDevice);

//INSERT Device
router.post("/devices/:idEmpresa", addDevice);

//GET All Devices
router.get("/devices/:idEmpresa", getAllDevices);

//DELETE Device
router.delete("/devices/:androidID", deleteDevice );

//UPDATE Device
router.put("/devices", updateDevice );

//UPDATE Version Device
router.patch("/devices/:androidId/:idEmpresa", updateVersionDevice );


// TABLE REQUEST DEVICE

// INSERT Request Device
router.post("/request_device/:idEmpresa", addRequestDevice);

//GET All Request Devices
router.get("/request_device", getRequestDevices);

//GET All Request Devices Pending
router.get("/request_device/count_pending", countPending);

//PATCH Request Devices Change Status
router.patch("/request_device/:androidID", statusAdded );

//DELETE Request Devices
router.delete("/request_device/:androidID", deleteRequestDevice );

//DELETE Request Devices
router.delete("/request_device", deleteAllRequestDevice );

// TABLE PUESTOS

// GET Puestos Activos por Cliente y Objetivo
router.get("/puestos/:idCliente/:idObjetivo", getPuestos);

//TABLE APP VERSION

//GET Ultima version de la App disponible
router.get("/app_version/last_version/:idEmpresa", getLastVersion);

////////////////////////////////////////////////////////////////////////////////
//// BROUCLEAN FUNCTIONS ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// TABLE OBJETIVO (CLIENTES)

// GET all Clientes (Activos - BROUCLEAN)
router.get("/brouclean/clientes", getClientesBrouclean);

// GET Cliente (Activo - BROUCLEAN)
router.get("/brouclean/clientes/:nombreCliente", getClienteBrouclean);

// TABLE REQUEST DEVICE

//GET All Request Devices
router.get("/brouclean/request_device", getRequestDevicesBrouclean);

// INSERT Request Device
router.post("/brouclean/request_device", addRequestDeviceBrouclean);

//GET All Request Devices Pending
router.get("/brouclean/request_device/count_pending", countPendingBrouclean);

//PATCH Request Devices Change Status
router.patch("/brouclean/request_device/:androidID", statusAddedBrouclean );

//DELETE Request Devices
router.delete("/brouclean/request_device/:androidID", deleteRequestDeviceBrouclean );

//DELETE Request Devices
router.delete("/brouclean/request_device", deleteAllRequestDeviceBrouclean );

// TABLE PERSONAL

// GET Personal (BROUCLEAN)
//router.get("/brouclean/personal/:nroLegajo", getPersonalBrouclean);

// TABLE USERS

// GET Obtener todos los usuarios
router.get("/brouclean/users", getAllUsersBrouclean);

//POST Registro de usuario
router.post("/brouclean/register", userRegisterBrouclean);

//POST Login de usuario
router.post("/brouclean/login", userLoginBrouclean);

// GET Obtener perfil de usuario
router.get("/brouclean/users/:persCodi", getUserProfileBrouclean);

//PATCH User Key
router.patch("/brouclean/recovery_key", userRecoveryKeyBrouclean);

//DELETE User
router.delete("/brouclean/users/:userCodi", deleteUserBrouclean );

// TABLE DEVICE

//GET Device
router.get("/brouclean/devices", getAllDevicesBrouclean);

//INSERT Device
router.post("/brouclean/devices", addDeviceBrouclean);

//DELETE Device
router.delete("/brouclean/devices/:androidID", deleteDeviceBrouclean);

//UPDATE Device
router.put("/brouclean/devices", updateDeviceBrouclean );

//UPDATE Version Device
// router.patch("/brouclean/devices/:androidId", updateVersionDeviceBrouclean );

// TABLE ASIG BROUCLEAN

// POST Cargar Hora Ingreso Personal
router.post("/brouclean/asig_brouclean", addPuestoBrouclean);

// PATCH Cargar Hora Egreso Personal
router.patch("/brouclean/asig_brouclean/:asigId", setHoraEgresoBrouclean)

// TABLE LAST SESION

// POST Cargar Ultima Sesion
router.post("/brouclean/last_session", setLastSessionBrouclean);

// GET Cargar Ultima Sesion
router.get("/brouclean/last_session/:persCodi", getLastSessionBrouclean);

// PATCH Cerrar Ultima Sesion
router.patch("/brouclean/last_session/:persCodi", closeLastSessionBrouclean);

//TABLE APP VERSION

//GET Ultima version de la App disponible
//router.get("/brouclean/app_version/last_version", getLastVersionBrouclean);



//export default router;
module.exports = router;
