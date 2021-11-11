const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;
const Run = db.run;
const Enemie = db.enemie;
const Arme = db.arme;
const Perso = db.perso;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.deleteUser =(req,res)=>{
	console.log("delete",req.body);
User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({ reason: 'User Not Found.' });
		}
		
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ reason: 'Invalid Password!' });
		}
		else{
			//return res.status(200).send({ reason: 'User Deleted.' });
			
			User.destroy({
				where: {
			username: req.body.username
			}
			}).then(()=>{
			return res.status(200).send({ reason: 'User Deleted.' });
			})
		}
	})
}

exports.updateUserName =(req,res)=>{
	console.log("update req",req.body);
User.findOne({
where: {
	username: req.body.nameUpdate
}}).then(toke => toke === null).then(unique => {
	console.log("test update",unique);

	if(!unique){
		return res.status(401).send({ reason: 'Name already taken!' });
	}

	User.findOne({
			where: {
				username: req.body.username
			}
		}).then(user => {
			console.log("update",user.username);
			
			if (!user) {
				return res.status(404).send({ reason: 'User Not Found.' });
			}
			
			var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) {
				return res.status(401).send({ reason: 'Invalid Password!' });
			}
			else{
				user.username=req.body.nameUpdate;
				user.save().then(()=>{
					return res.status(200).send({ reason: 'User name updated' });
				});
			}
		})
	})
}

exports.signup = (req, res) => {
	// Save User to Database
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		Role.findAll({
			where: {
				name: {
					[Op.or]: req.body.roles
				}
			}
		}).then(roles => {
			user.setRoles(roles).then(() => {
				res.send({ message: 'Registered successfully!' });
			});
		}).catch(err => {
			res.status(500).send({ reason: err.message });
		});
	}).catch(err => {
		res.status(500).send({ reason: err.message });
	})
}

exports.signin = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({ reason: 'User Not Found.' });
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password!' });
		}

		var token = jwt.sign({ id: user.id }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});

		var authorities = [];
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				authorities.push('ROLE_' + roles[i].name.toUpperCase());
			}
			res.status(200).send({
				auth: true,
				accessToken: token,
				username: user.username,
				authorities: authorities
			});
		})
	}).catch(err => {
		res.status(500).send({ reason: err.message });
	});
}

exports.userContent = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> User Contents!',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access User Page',
			'error': err
		});
	})
}

exports.adminBoard = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> Admin Contents',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Admin Board',
			'error': err
		});
	})
}

exports.managementBoard = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> Project Management Board',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Management Board',
			'error': err
		});
	})
}

/********************************liste scores*******************************/

exports.getAllRun = (req, res) => {
	Run.findAll(
		{
		include: [
		{model:Enemie, as:'enemy',required: false,attributes:['idenemies','nom']},
		{model:User, as:'User',required: false,attributes:['id','username']},
		{model:Arme, as:'Arme1',required: false,attributes:['idarme','nom']},
		{model:Arme, as:'Arme2',required: false,attributes:['idarme','nom']},
		{model:Perso, as:'Perso',required: false,attributes:['idpersos','nom']}
		],
		order:[['idrun', 'ASC']]
		}
		
		//{attributes:['idrun'],include: [{model:Enemie, as:'enemie', required:false, attributes:['nom']}]}
		).then(run => {
		res.status(200).send({
			'description': '>>> Run Contents!',
			'run': run
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Run',
			'error': err
		});
	})
}

exports.getAllRunUser = (req, res) => {
	Run.findAll(
		{
		include: [
		{model:Enemie, as:'enemy',required: false,attributes:['idenemies','nom']},
		{model:User, as:'User',required: false,attributes:['id','username']},
		{model:Arme, as:'Arme1',required: false,attributes:['idarme','nom']},
		{model:Arme, as:'Arme2',required: false,attributes:['idarme','nom']},
		{model:Perso, as:'Perso',required: false,attributes:['idpersos','nom']}
		],
		where:{'$User.id$':req.userId},
		order:[['idrun', 'ASC']]
		}
		
		//{attributes:['idrun'],include: [{model:Enemie, as:'enemie', required:false, attributes:['nom']}]}
		).then(run => {
		res.status(200).send({
			'description': '>>> Run Contents!',
			'run': run
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Run',
			'error': err
		});
	})
}

exports.getAllUser = (req, res) => {
	User.findAll().then(user => {
		res.status(200).send({
			'description': '>>> Users Contents!',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Users',
			'error': err
		});
	})
}

exports.getAllEnemies = (req, res) => {
	Enemie.findAll().then(enemie => {
		res.status(200).send({
			'description': '>>> Enemies Contents!',
			'enemie': enemie
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Enemies',
			'error': err
		});
	})
}