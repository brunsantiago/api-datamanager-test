//import { pool } from "../db.js";
const pool = require("../db.js");
//import { createRequire } from "module";
//const require = createRequire(import.meta.url);
const bcryptjs = require('bcryptjs');

// TABLE USERS

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT USER_CODI, USER_LEGA, USER_PERF, PERS_NOMB, PERS_SECT, PERS_FEGR FROM users JOIN personal ON users.USER_CODI = personal.PERS_CODI;");
    res.json(rows);
  }
  catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { persCodi } = req.params;
    const [result] = await pool.query("SELECT USER_PERF FROM users WHERE USER_CODI = ? ",
    [ persCodi ]);
    res.json({ result: result[0].USER_PERF });
  } catch (error) {
    return res.status(500).json({ result: "" });
  }
};

const userRegister = async (req, res) => {
  try {
    const { user_codi, user_lega, user_perf, user_pass } = req.body;
    let user_pass_encrypt = await bcryptjs.hash(user_pass, 8);
    const [result] = await pool.query(
      "INSERT INTO users SET USER_CODI = ?, USER_LEGA = ?,	USER_PERF = ?,	USER_PASS = ? ",
      [ user_codi, user_lega, user_perf, user_pass_encrypt ]
    );
    // result = 1 Registracion correcta
    return res.json({ result : result.affectedRows });
  } catch (error) {
    // result = 2 Usuario ya registrado
    return res.status(500).json({ result: 2 });
  }
};

const userLogin = async (req, res) => {
  try {
    const { user_lega, user_pass } = req.body;
    let user_pass_encrypt = await bcryptjs.hash(user_pass, 8);
    const [result] = await pool.query(
      "SELECT * FROM users WHERE USER_LEGA = ?",
      [ user_lega ]
    );
    if(result.length==0){
      return res.json({ result : "NOT_FOUND" });
    }else if (await bcryptjs.compare(user_pass,result[0].USER_PASS)) {
      return res.json({ result : "CORRECT_LOGIN" });
    }else {
      return res.json({ result : "INCORRECT_LOGIN" });
    }
  } catch (error) {
    return res.status(500).json({ result: error.code });
  }
};

const userRecoveryKey = async (req, res) => {
  try {
    const { user_codi, user_pass } = req.body;
    let user_pass_encrypt = await bcryptjs.hash(user_pass, 8);
    const [result] = await pool.query("UPDATE users SET USER_PASS = ? WHERE USER_CODI = ?",
    [ user_pass_encrypt, user_codi]);
    if (result.affectedRows === 0){
      return res.status(404).json({ result: 0 }); // No se encontro Usuario
    }else{
      res.status(201).json({ result: 1 }); // Usuario Modificado
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userCodi } = req.params;
    const [result] = await pool.query("DELETE FROM users WHERE USER_CODI = ?",[ userCodi ]);
    if (result.affectedRows === 0){
      res.status(404).json({ result: 0 }); // UserCodi no econtrado
    }else{
      res.status(201).json({ result: 1}); // Usuario Eliminado
    }
  } catch (error) {
    res.status(500).json({ result: 2 }); // Error en el Servidor
  }
};


// TABLE LAST_SESSION

const setLastSession = async (req, res) => {
  try {
    const { last_cper, last_ccli,	last_cobj,	last_fech,	last_dhor,	last_hhor,	last_usua,	last_pues,	last_npue, last_esta,	last_ncli,	last_nobj,	last_dhre, last_time, last_asid} = req.body;
    const [result] = await pool.query(
      "INSERT INTO last_session (LAST_CPER, LAST_CCLI,	LAST_COBJ,	LAST_FECH,	LAST_DHOR,	LAST_HHOR,	LAST_USUA,	LAST_PUES,	LAST_NPUE, LAST_ESTA, LAST_NCLI, LAST_NOBJ, LAST_DHRE, LAST_TIME, LAST_ASID ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE LAST_CCLI=VALUES(last_ccli),	LAST_COBJ=VALUES(last_cobj),	LAST_FECH=VALUES(last_fech),	LAST_DHOR=VALUES(last_dhor),	LAST_HHOR=VALUES(last_hhor),	LAST_USUA=VALUES(last_usua),	LAST_PUES=VALUES(last_pues),	LAST_NPUE =VALUES(last_npue ),	LAST_ESTA =VALUES(last_esta),	LAST_NCLI =VALUES(last_ncli),	LAST_NOBJ =VALUES(last_nobj),	LAST_DHRE=VALUES(last_dhre), LAST_TIME=VALUES(last_time), LAST_ASID=VALUES(last_asid)",
      [ last_cper, last_ccli,	last_cobj, last_fech,	last_dhor,	last_hhor,	last_usua,	last_pues,	last_npue, last_esta,	last_ncli,	last_nobj,	last_dhre, last_time, last_asid ]
    );
    return res.json({ result : result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong"+error });
  }
};

const getLastSession = async (req, res) => {
  try {
    const { persCodi } = req.params;
    const [rows] = await pool.query("SELECT * FROM last_session WHERE LAST_CPER = ? ",
    [ persCodi ]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const closeLastSession = async (req, res) => {
  try {
    const { persCodi } = req.params;
    const [result] = await pool.query("UPDATE last_session SET LAST_ESTA = 0 WHERE LAST_CPER = ?",
    [ persCodi ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ message: "Personal no econtrado" });
    }else{
      res.status(201).json({ message: "Estado cerrado correctamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

// TABLE ASIGVIGI

const setHoraEgresoVigilador = async (req, res) => {
  try {
    const { asigId } = req.params;
    const { horaEgreso } = req.body;
    const [result] = await pool.query("UPDATE asigvigi_app SET ASIG_HHOR = ? WHERE ASIG_ID = ?",
    [ horaEgreso, asigId]);
    if (result.affectedRows === 0){
      return res.status(404).json({ result: 0 });
    }else{
      res.status(201).json({ result: 1 });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

const addPuestoVigilador = async (req, res) => {
  try {
    const { asig_obje,	asig_vigi,	asig_fech,	asig_dhor,	asig_hhor,	asig_ause,	asig_deta,	asig_visa,	asig_obse,	asig_usua,	asig_time,	asig_fact,	asig_pues,	asig_bloq,	asig_esta,	asig_facm, asig_venc } = req.body;
    const [result] = await pool.query(
      "INSERT INTO asigvigi_app (ASIG_OBJE,	ASIG_VIGI,	ASIG_FECH,	ASIG_DHOR,	ASIG_HHOR,	ASIG_AUSE,	ASIG_DETA,	ASIG_VISA,	ASIG_OBSE,	ASIG_USUA,	ASIG_TIME,	ASIG_FACT,	ASIG_PUES,	ASIG_BLOQ,	ASIG_ESTA,	ASIG_FACM, ASIG_VENC ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [ asig_obje,	asig_vigi,	asig_fech,	asig_dhor,	asig_hhor,	asig_ause,	asig_deta,	asig_visa,	asig_obse,	asig_usua,	asig_time,	asig_fact,	asig_pues,	asig_bloq,	asig_esta,	asig_facm, asig_venc ]
    );
    return res.status(201).json({ result : result.affectedRows,
                                  asigId : result.insertId,
                                });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong"+error });
  }
};

// TABLE PERSONAL

const getPersonal = async (req, res) => {
  try {
    const { nroLegajo } = req.params;
    const [rows] = await pool.query("SELECT PERS_CODI, TRIM(PERS_NOMB) AS PERS_NOMB, PERS_NDOC, PERS_FNAC, PERS_SECT, PERS_FEGR FROM personal WHERE PERS_EMPR=1 AND PERS_LEGA = ? ",
    [ nroLegajo ]);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

// TABLE OBJETIVOS (CLIENTES)

const getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT OBJE_CODI, TRIM(OBJE_NOMB) AS OBJE_NOMB FROM objetivo WHERE OBJE_EMPR=1 AND OBJE_BAJA IS NULL ORDER BY OBJE_NOMB ASC");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const getCliente = async (req, res) => {
  try {
    const { nombreCliente } = req.params;
    const [rows] = await pool.query("SELECT OBJE_CODI, TRIM(OBJE_NOMB) AS OBJE_NOMB FROM objetivo WHERE OBJE_EMPR=1 AND OBJE_BAJA IS NULL AND OBJE_NOMB=?",
    [ nombreCliente ]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

// TABLE PUESGRUP (OBJETIVOS)

const getAllObjetivos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT GRUP_CODI, TRIM(GRUP_NOMB) AS GRUP_NOMB FROM puestos, puesgrup WHERE PUES_GRUP=GRUP_CODI AND OBJE_BAJA IS NULL");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const getObjetivos = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const [rows] = await pool.query("SELECT DISTINCT GRUP_CODI, TRIM(GRUP_NOMB) AS GRUP_NOMB FROM puestos, puesgrup WHERE PUES_GRUP=GRUP_CODI AND PUES_OBJE = ? AND OBJE_BAJA IS NULL AND PUES_TIPO != 3",
    [ idCliente ]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const requestCoordinate = async (req, res) => {
  try {
    const { idObjetivo } = req.params;
    const [result] = await pool.query("SELECT OBJE_COOR FROM puesgrup WHERE GRUP_CODI= ?",
    [ idObjetivo ]);
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

// TABLE DEVICES

const getDevice = async (req, res) => {
  try {
    const { androidID } = req.params;
    const [rows] = await pool.query("SELECT * FROM devices WHERE DEVI_ANID = ?",
    [ androidID ]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ result: 1 });
  }
};

const addDevice = async (req, res) => {
  try {
    const { devi_anid,	devi_date,	devi_esta,	devi_ccli,	devi_cobj,	devi_marc,	devi_mode, devi_ncli,	devi_nobj, devi_nlin, devi_coor, devi_radi, devi_ubic, devi_vers } = req.body;
    const [result] = await pool.query(
      "INSERT INTO devices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [ devi_anid,	devi_date,	devi_esta,	devi_ccli,	devi_cobj,	devi_marc,	devi_mode, devi_ncli,	devi_nobj, devi_nlin, devi_coor, devi_radi, devi_ubic, devi_vers ]
    );
    res.json({ result: 0 } );
  } catch (error) {
    res.json({ result: 1 });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM devices");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something goes wrong" });
  }
};

const deleteDevice = async (req, res) => {
  try {
    const { androidID } = req.params;
    const [result] = await pool.query("DELETE FROM devices WHERE DEVI_ANID = ?",
    [ androidID ]);
    if (result.affectedRows === 0){
      res.status(404).json({ result: 0 }); // Android ID no econtrado
    }else{
      res.status(201).json({ result: 1}); // Dispositivo Eliminado
    }
  } catch (error) {
    res.status(500).json({ result: 2 }); // Error en el Servidor
  }
};

const updateDevice = async (req, res) => {
  try {
    const { devi_nlin, devi_date,	devi_esta,	devi_ccli,	devi_cobj,	devi_ncli,	devi_nobj, devi_ubic, devi_coor, devi_radi, devi_anid } = req.body;
    const [result] = await pool.query("UPDATE devices SET DEVI_NLIN=?, DEVI_DATE=?, DEVI_ESTA=?, DEVI_CCLI=?, DEVI_COBJ=?,	DEVI_NCLI=?, DEVI_NOBJ=?, DEVI_UBIC=?, DEVI_COOR=?, DEVI_RADI=? WHERE DEVI_ANID = ?",
    [ devi_nlin, devi_date,	devi_esta,	devi_ccli,	devi_cobj, devi_ncli,	devi_nobj, devi_ubic, devi_coor, devi_radi, devi_anid ]
    );
    if (result.affectedRows === 0){
      res.status(200).json({ result: 0 }); // Android ID no econtrado o sin cambios
    }else{
      res.status(201).json({ result: 1}); // Dispositivo Actualizado
    }
  } catch (error) {
    res.status(500).json({ result: 2 }); // Error en el Servidor
  }
};

// TABLE NOTIFICATION

const getCounter = async (req, res) => {
  try {
    const { nameCounter } = req.params;
    const [result] = await pool.query("SELECT counter FROM notification WHERE name = ? ",
    [ nameCounter ]);
    return res.status(201).json({ result: result[0].counter });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const incrementCounter = async (req, res) => {
  try {
    const { nameCounter } = req.params;
    const [result] = await pool.query("UPDATE notification SET counter = counter + 1 WHERE name = ?",
    [ nameCounter ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ message: "Counter no econtrado" });
    }else{
      res.status(201).json({ message: "Notificacion incrementada correctamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong: " + error });
  }
};

const decrementCounter = async (req, res) => {
  try {
    const { nameCounter } = req.params;
    const [result] = await pool.query("UPDATE notification SET counter = counter - 1 WHERE name = ?",
    [ nameCounter ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ message: "Counter no econtrado" });
    }else{
      res.status(201).json({ message: "Notificacion decrementada correctamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

// TABLE REQUEST DEVICES

const getRequestDevices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM request_device");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something goes wrong" });
  }
};

const countPending = async (req, res) => {
  try {
    const { nameCounter } = req.params;
    const [result] = await pool.query("SELECT COUNT(*) AS counter FROM request_device WHERE RDEV_ESTA = 'pending' ");
    return res.status(201).json({ counter: result[0].counter });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addRequestDevice = async (req, res) => {
  try {
    const { rdev_anid,	rdev_date,	rdev_esta,	rdev_ccli,	rdev_cobj,	rdev_marc,	rdev_mode, rdev_vers,	rdev_nomb,	rdev_ncli,	rdev_nobj,	rdev_cper, rdev_nlin } = req.body;
    const [result] = await pool.query(
      "INSERT INTO request_device (RDEV_ANID, RDEV_DATE, RDEV_ESTA, RDEV_CCLI, RDEV_COBJ, RDEV_MARC, RDEV_MODE, RDEV_VERS,	RDEV_NOMB,	RDEV_NCLI,	RDEV_NOBJ,	RDEV_CPER, RDEV_NLIN ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE RDEV_DATE=VALUES(rdev_date), RDEV_ESTA=VALUES(rdev_esta), RDEV_CCLI=VALUES(rdev_ccli), RDEV_COBJ=VALUES(rdev_cobj), RDEV_MARC=VALUES(rdev_marc), RDEV_MODE=VALUES(rdev_mode),	RDEV_VERS=VALUES(rdev_vers), RDEV_NOMB=VALUES(rdev_nomb),	RDEV_NCLI=VALUES(rdev_ncli),	RDEV_NOBJ=VALUES(rdev_nobj),	RDEV_CPER=VALUES(rdev_cper),	RDEV_NLIN=VALUES(rdev_nlin)",
      [ rdev_anid,	rdev_date,	rdev_esta,	rdev_ccli,	rdev_cobj,	rdev_marc,	rdev_mode, rdev_vers,	rdev_nomb,	rdev_ncli,	rdev_nobj,	rdev_cper, rdev_nlin ]
    );
    return res.json({ result : result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong"+error });
  }
};

const statusAdded = async (req, res) => {
  try {
    const { androidID } = req.params;
    const [result] = await pool.query("UPDATE request_device SET RDEV_ESTA = 'added' WHERE RDEV_ANID = ?",
    [ androidID ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ message: "androidID no econtrado" }); // Cambiar status para que no salte como error cuando no hay modificaciones
    }else{
      return res.status(201).json({ message: "Estado de solicitud cambiada" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

const deleteRequestDevice = async (req, res) => {
  try {
    const { androidID } = req.params;
    const [result] = await pool.query("DELETE FROM request_device WHERE RDEV_ANID = ?",
    [ androidID ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ result: 0 }); //androidID no econtrado
    }else{
      res.status(201).json({ result: 1}); //Estado de solicitud cambiada
    }
  } catch (error) {
    return res.status(500).json({ result: 2 }); //Error en el Servidor
  }
};

const deleteAllRequestDevice = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM request_device");
    res.status(201).json({ result: 1}); // Todas las solicitudes eliminadas
  } catch (error) {
    res.status(500).json({ result: 2 }); //Error en el Servidor
  }
};

// TABLE PUESTOS

const getPuestos = async (req, res) => {
  try {
    const { idCliente, idObjetivo } = req.params;
    const [rows] = await pool.query("SELECT * FROM puestos WHERE PUES_OBJE = ? AND PUES_GRUP = ? AND PUES_TIPO != 3",
    [ idCliente, idObjetivo ]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

// TABLE APP version

const getLastVersion = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM app_version WHERE version_code = (SELECT MAX(version_code) FROM app_version)");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


////////////////////////////////////////////////////////////////////////////////
//// BROUCLEAN FUNCTIONS ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// TABLE OBJETIVO (CLIENTES)

const getClientesBrouclean = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT OBJE_CODI, TRIM(OBJE_NOMB) AS OBJE_NOMB FROM objetivo WHERE OBJE_EMPR=3 AND OBJE_BAJA IS NULL ORDER BY OBJE_NOMB ASC");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const getClienteBrouclean = async (req, res) => {
  try {
    const { nombreCliente } = req.params;
    const [rows] = await pool.query("SELECT OBJE_CODI, TRIM(OBJE_NOMB) AS OBJE_NOMB FROM objetivo WHERE OBJE_EMPR=3 AND OBJE_BAJA IS NULL AND OBJE_NOMB=?",
    [ nombreCliente ]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

// TABLE REQUEST DEVICES

const getRequestDevicesBrouclean = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM request_device_brouclean");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something goes wrong" });
  }
};

const addRequestDeviceBrouclean = async (req, res) => {
  try {
    const { rdev_anid,	rdev_date,	rdev_esta,	rdev_ccli,	rdev_cobj,	rdev_marc,	rdev_mode, rdev_vers,	rdev_nomb,	rdev_ncli,	rdev_nobj,	rdev_cper, rdev_nlin } = req.body;
    const [result] = await pool.query(
      "INSERT INTO request_device_brouclean (RDEV_ANID, RDEV_DATE, RDEV_ESTA, RDEV_CCLI, RDEV_COBJ, RDEV_MARC, RDEV_MODE, RDEV_VERS,	RDEV_NOMB,	RDEV_NCLI,	RDEV_NOBJ,	RDEV_CPER, RDEV_NLIN ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE RDEV_DATE=VALUES(rdev_date), RDEV_ESTA=VALUES(rdev_esta), RDEV_CCLI=VALUES(rdev_ccli), RDEV_COBJ=VALUES(rdev_cobj), RDEV_MARC=VALUES(rdev_marc), RDEV_MODE=VALUES(rdev_mode),	RDEV_VERS=VALUES(rdev_vers), RDEV_NOMB=VALUES(rdev_nomb),	RDEV_NCLI=VALUES(rdev_ncli),	RDEV_NOBJ=VALUES(rdev_nobj),	RDEV_CPER=VALUES(rdev_cper),	RDEV_NLIN=VALUES(rdev_nlin)",
      [ rdev_anid,	rdev_date,	rdev_esta,	rdev_ccli,	rdev_cobj,	rdev_marc,	rdev_mode, rdev_vers,	rdev_nomb,	rdev_ncli,	rdev_nobj,	rdev_cper, rdev_nlin ]
    );
    return res.json({ result : result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong"+error });
  }
};

const countPendingBrouclean = async (req, res) => {
  try {
    const { nameCounter } = req.params;
    const [result] = await pool.query("SELECT COUNT(*) AS counter FROM request_device_brouclean WHERE RDEV_ESTA = 'pending' ");
    return res.status(201).json({ counter: result[0].counter });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const statusAddedBrouclean = async (req, res) => {
  try {
    const { androidID } = req.params;
    const [result] = await pool.query("UPDATE request_device_brouclean SET RDEV_ESTA = 'added' WHERE RDEV_ANID = ?",
    [ androidID ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ message: "androidID no econtrado" }); // Cambiar status para que no salte como error cuando no hay modificaciones
    }else{
      return res.status(201).json({ message: "Estado de solicitud cambiada" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

const deleteRequestDeviceBrouclean = async (req, res) => {
  try {
    const { androidID } = req.params;
    const [result] = await pool.query("DELETE FROM request_device_brouclean WHERE RDEV_ANID = ?",
    [ androidID ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ result: 0 }); //androidID no econtrado
    }else{
      res.status(201).json({ result: 1}); //Estado de solicitud cambiada
    }
  } catch (error) {
    return res.status(500).json({ result: 2 }); //Error en el Servidor
  }
};

const deleteAllRequestDeviceBrouclean = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM request_device_brouclean");
    res.status(201).json({ result: 1}); // Todas las solicitudes eliminadas
  } catch (error) {
    res.status(500).json({ result: 2 }); //Error en el Servidor
  }
};

// TABLE PERSONAL

const getPersonalBrouclean = async (req, res) => {
  try {
    const { nroLegajo } = req.params;
    const [rows] = await pool.query("SELECT PERS_CODI, TRIM(PERS_NOMB) AS PERS_NOMB, PERS_NDOC, PERS_FNAC, PERS_SECT, PERS_FEGR FROM personal WHERE PERS_EMPR=3 AND PERS_LEGA = ? ",
    [ nroLegajo ]);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

// TABLE USERS

const getAllUsersBrouclean = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT USER_CODI, USER_LEGA, USER_PERF, PERS_NOMB, PERS_SECT, PERS_FEGR FROM users_brouclean JOIN personal ON users_brouclean.USER_CODI = personal.PERS_CODI;");
    res.json(rows);
  }
  catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const userRegisterBrouclean = async (req, res) => {
  try {
    const { user_codi, user_lega, user_perf, user_pass } = req.body;
    let user_pass_encrypt = await bcryptjs.hash(user_pass, 8);
    const [result] = await pool.query(
      "INSERT INTO users_brouclean SET USER_CODI = ?, USER_LEGA = ?,	USER_PERF = ?,	USER_PASS = ? ",
      [ user_codi, user_lega, user_perf, user_pass_encrypt ]
    );
    // result = 1 Registracion correcta
    return res.json({ result : result.affectedRows });
  } catch (error) {
    // result = 2 Usuario ya registrado
    return res.status(500).json({ result: 2 });
  }
};

const userLoginBrouclean = async (req, res) => {
  try {
    const { user_lega, user_pass } = req.body;
    let user_pass_encrypt = await bcryptjs.hash(user_pass, 8);
    const [result] = await pool.query(
      "SELECT * FROM users_brouclean WHERE USER_LEGA = ?",
      [ user_lega ]
    );
    if(result.length==0){
      return res.json({ result : "NOT_FOUND" });
    }else if (await bcryptjs.compare(user_pass,result[0].USER_PASS)) {
      return res.json({ result : "CORRECT_LOGIN" });
    }else {
      return res.json({ result : "INCORRECT_LOGIN" });
    }
  } catch (error) {
    return res.status(500).json({ result: error.code });
  }
};

const getUserProfileBrouclean = async (req, res) => {
  try {
    const { persCodi } = req.params;
    const [result] = await pool.query("SELECT USER_PERF FROM users_brouclean WHERE USER_CODI = ? ",
    [ persCodi ]);
    res.json({ result: result[0].USER_PERF });
  } catch (error) {
    return res.status(500).json({ result: "" });
  }
};

const userRecoveryKeyBrouclean = async (req, res) => {
  try {
    const { user_codi, user_pass } = req.body;
    let user_pass_encrypt = await bcryptjs.hash(user_pass, 8);
    const [result] = await pool.query("UPDATE users_brouclean SET USER_PASS = ? WHERE USER_CODI = ?",
    [ user_pass_encrypt, user_codi]);
    if (result.affectedRows === 0){
      return res.status(404).json({ result: 0 }); // No se encontro Usuario
    }else{
      res.status(201).json({ result: 1 }); // Usuario Modificado
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

const deleteUserBrouclean = async (req, res) => {
  try {
    const { userCodi } = req.params;
    const [result] = await pool.query("DELETE FROM users_brouclean WHERE USER_CODI = ?",[ userCodi ]);
    if (result.affectedRows === 0){
      res.status(404).json({ result: 0 }); // UserCodi no econtrado
    }else{
      res.status(201).json({ result: 1}); // Usuario Eliminado
    }
  } catch (error) {
    res.status(500).json({ result: 2 }); // Error en el Servidor
  }
};

// TABLE DEVICES

const getAllDevicesBrouclean = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM devices_brouclean");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something goes wrong" });
  }
};

const addDeviceBrouclean = async (req, res) => {
  try {
    const { devi_anid,	devi_date,	devi_esta,	devi_ccli,	devi_cobj,	devi_marc,	devi_mode, devi_ncli,	devi_nobj, devi_nlin, devi_coor, devi_radi, devi_ubic, devi_vers } = req.body;
    const [result] = await pool.query(
      "INSERT INTO devices_brouclean VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [ devi_anid,	devi_date,	devi_esta,	devi_ccli,	devi_cobj,	devi_marc,	devi_mode, devi_ncli, devi_nobj, devi_nlin, devi_coor, devi_radi, devi_ubic, devi_vers ]
    );
    res.json({ result: 0 } );
  } catch (error) {
    res.json({ result: error });
  }
};

const deleteDeviceBrouclean = async (req, res) => {
  try {
    const { androidID } = req.params;
    const [result] = await pool.query("DELETE FROM devices_brouclean WHERE DEVI_ANID = ?",
    [ androidID ]);
    if (result.affectedRows === 0){
      res.status(404).json({ result: 0 }); // Android ID no econtrado
    }else{
      res.status(201).json({ result: 1}); // Dispositivo Eliminado
    }
  } catch (error) {
    res.status(500).json({ result: 2 }); // Error en el Servidor
  }
};

const updateDeviceBrouclean = async (req, res) => {
  // No es necesario cambiar todos los campos porque algunos estan bloqueados para su modificacion
  try {
    const { devi_nlin, devi_date,	devi_esta,	devi_ccli,	devi_cobj,	devi_ncli,	devi_nobj, devi_ubic, devi_coor, devi_radi, devi_anid} = req.body;
    const [result] = await pool.query("UPDATE devices_brouclean SET DEVI_NLIN=?, DEVI_DATE=?, DEVI_ESTA=?, DEVI_CCLI=?, DEVI_COBJ=?,	DEVI_NCLI=?, DEVI_NOBJ=?, DEVI_UBIC=?, DEVI_COOR=?, DEVI_RADI=? WHERE DEVI_ANID = ?",
    [ devi_nlin, devi_date,	devi_esta,	devi_ccli,	devi_cobj, devi_ncli,	devi_nobj, devi_ubic, devi_coor, devi_radi, devi_anid ]
    );
    if (result.affectedRows === 0){
      res.status(200).json({ result: 0 }); // Android ID no econtrado o sin cambios
    }else{
      res.status(201).json({ result: 1}); // Dispositivo Actualizado
    }
  } catch (error) {
    res.status(500).json({ result: 2 }); // Error en el Servidor
  }
};

const updateVersionDeviceBrouclean = async (req, res) => {
  // No es necesario cambiar todos los campos porque algunos estan bloqueados para su modificacion
  try {
    const { androidId } = req.params;
    const { appVersion } = req.body;
    const [result] = await pool.query("UPDATE devices_brouclean SET DEVI_VERS=? WHERE DEVI_ANID = ?",
    [ appVersion, androidId ]
    );
    if (result.affectedRows === 0){
      res.status(200).json({ result: 0 }); // Android ID no econtrado o sin cambios
    }else{
      res.status(201).json({ result: 1}); // Dispositivo Actualizado
    }
  } catch (error) {
    res.status(500).json({ result: 2 }); // Error en el Servidor
  }
};

// TABLE ASIG BROUCLEAN

const addPuestoBrouclean = async (req, res) => {
  try {
    const { asig_obje,	asig_vigi,	asig_fech,	asig_dhor,	asig_hhor,	asig_ause,	asig_deta,	asig_visa,	asig_obse,	asig_usua,	asig_time,	asig_fact,	asig_pues,	asig_bloq,	asig_esta,	asig_facm, asig_venc, asig_empr } = req.body;
    const [result] = await pool.query(
      "INSERT INTO asigvigi_app (ASIG_OBJE,	ASIG_VIGI,	ASIG_FECH,	ASIG_DHOR,	ASIG_HHOR,	ASIG_AUSE,	ASIG_DETA,	ASIG_VISA,	ASIG_OBSE,	ASIG_USUA,	ASIG_TIME,	ASIG_FACT,	ASIG_PUES,	ASIG_BLOQ,	ASIG_ESTA,	ASIG_FACM, ASIG_VENC, ASIG_EMPR ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [ asig_obje,	asig_vigi,	asig_fech,	asig_dhor,	asig_hhor,	asig_ause,	asig_deta,	asig_visa,	asig_obse,	asig_usua,	asig_time,	asig_fact,	asig_pues,	asig_bloq,	asig_esta,	asig_facm, asig_venc, asig_empr ]
    );
    return res.status(201).json({ result : result.affectedRows,
                                  asigId : result.insertId,
                                });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong"+error });
  }
};

const setHoraEgresoBrouclean = async (req, res) => {
  try {
    const { asigId } = req.params;
    const { horaEgreso } = req.body;
    const [result] = await pool.query("UPDATE asigvigi_app SET ASIG_HHOR = ? WHERE ASIG_ID = ?",
    [ horaEgreso, asigId]);
    if (result.affectedRows === 0){
      return res.status(404).json({ result: 0 });
    }else{
      res.status(201).json({ result: 1 });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

// TABLE LAST_SESSION

const setLastSessionBrouclean = async (req, res) => {
  try {
    const { last_cper, last_ccli,	last_cobj,	last_fech,	last_dhor,	last_hhor,	last_usua,	last_pues,	last_npue, last_esta,	last_ncli,	last_nobj,	last_dhre, last_time, last_asid} = req.body;
    const [result] = await pool.query(
      "INSERT INTO last_session_brouclean (LAST_CPER, LAST_CCLI,	LAST_COBJ,	LAST_FECH,	LAST_DHOR,	LAST_HHOR,	LAST_USUA,	LAST_PUES,	LAST_NPUE, LAST_ESTA, LAST_NCLI, LAST_NOBJ, LAST_DHRE, LAST_TIME, LAST_ASID ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE LAST_CCLI=VALUES(last_ccli),	LAST_COBJ=VALUES(last_cobj),	LAST_FECH=VALUES(last_fech),	LAST_DHOR=VALUES(last_dhor),	LAST_HHOR=VALUES(last_hhor),	LAST_USUA=VALUES(last_usua),	LAST_PUES=VALUES(last_pues),	LAST_NPUE =VALUES(last_npue ),	LAST_ESTA =VALUES(last_esta),	LAST_NCLI =VALUES(last_ncli),	LAST_NOBJ =VALUES(last_nobj),	LAST_DHRE=VALUES(last_dhre), LAST_TIME=VALUES(last_time), LAST_ASID=VALUES(last_asid)",
      [ last_cper, last_ccli,	last_cobj, last_fech,	last_dhor,	last_hhor,	last_usua,	last_pues,	last_npue, last_esta,	last_ncli,	last_nobj,	last_dhre, last_time, last_asid ]
    );
    return res.json({ result : result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong"+error });
  }
};

const getLastSessionBrouclean = async (req, res) => {
  try {
    const { persCodi } = req.params;
    const [rows] = await pool.query("SELECT * FROM last_session_brouclean WHERE LAST_CPER = ? ",
    [ persCodi ]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const closeLastSessionBrouclean = async (req, res) => {
  try {
    const { persCodi } = req.params;
    const [result] = await pool.query("UPDATE last_session_brouclean SET LAST_ESTA = 0 WHERE LAST_CPER = ?",
    [ persCodi ]);
    if (result.affectedRows === 0){
      return res.status(404).json({ message: "Personal no econtrado" });
    }else{
      res.status(201).json({ message: "Estado cerrado correctamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

// TABLE APP version

const getLastVersionBrouclean = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM app_version_brouclean WHERE version_code = (SELECT MAX(version_code) FROM app_version)");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


/**
 * Pseudo-random string generator
 * http://stackoverflow.com/a/27872144/383904
 * Default: return a random alpha-numeric string
 *
 * @param {Integer} len Desired length
 * @param {String} an Optional (alphanumeric), "a" (alpha), "n" (numeric)
 * @return {String}
 */
function randomString(len, an) {
  an = an && an.toLowerCase();
  var str = "",
    i = 0,
    min = an == "a" ? 10 : 0,
    max = an == "n" ? 10 : 62;
  for (; i++ < len;) {
    var r = Math.random() * (max - min) + min << 0;
    str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
  }
  return str;
}

module.exports = {
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
  getPersonalBrouclean,
  userRegisterBrouclean,
  userLoginBrouclean,
  getUserProfileBrouclean,
  getAllDevicesBrouclean,
  addPuestoBrouclean,
  setLastSessionBrouclean,
  getLastSessionBrouclean,
  closeLastSessionBrouclean,
  setHoraEgresoBrouclean,
  getLastVersionBrouclean,
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
  updateVersionDeviceBrouclean
  };
