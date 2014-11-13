"use strict";
var C_SPIN_DECAY_FACTOR = 1;
var C_BALL_SPEED_INCREASE = 0.03;
var C_PAD_SPEED_INCREASE = 0.001;
var C_FRICTION_FACTOR_WALL = .1;
var C_FRICTION_FACTOR_PAD = .6;
var C_FRICTION_FACTOR_SPECIAL = .6;
var C_SPIN_FACTOR = 3;
var C_PAD_TRACK_HISTROY_SIZE = .2;
var ballSpinVectorfawefweafaef = vec4.fromValues(1, 0, 0, 0.0);
var ballspeedLimitfjaiwoejfiweaf = .3;
var ballSpeedVectorj8g9awjefwae = [.2, .4, ballspeedLimitfjaiwoejfiweaf];
var ballRotationfjw0oajwfioef = vec4.fromValues();
function physicfawefwaefawfeawf(delta, ball) {
	//decrease rate of spin
	ballSpinVectorfawefweafaef[3] *= Math.pow(Math.E, -C_SPIN_DECAY_FACTOR * delta);
	//increase rate of speed
	ballspeedLimitfjaiwoejfiweaf += C_BALL_SPEED_INCREASE * delta;
	//	padspeedlimitfawehsftageraef += C_PAD_SPEED_INCREASE * delta;

	//Magnus effect
	magnus(delta, ball);
	//bounce

	//move test
	var tmp_ballposition_fhuawiefjaw = [];
	vec3.copy(tmp_ballposition_fhuawiefjaw, ballSpeedVectorj8g9awjefwae);
	v_mul(tmp_ballposition_fhuawiefjaw, delta);
	vec3.add(tmp_ballposition_fhuawiefjaw, ball.position, tmp_ballposition_fhuawiefjaw);

	var C_ballSize = ball.size;
	for ( i = 0; i < 3; i++) {
		var tempv = 0;
		var tmp_frictionfactor = C_FRICTION_FACTOR_WALL;
		var tmp_padvector_fjhuawiehfaw = [0, 0, 0];
		if (tmp_ballposition_fhuawiefjaw[i] > boxSize[i] / boxSize[2] / 2 - C_ballSize) {
			switch(i) {
			case 0:
				knockOnGrid('+x', ball.position);
				break;
			case 1:
				knockOnGrid('+y', ball.position);
				break;
			case 2:
				if (!checkInPadfjawioejfawoief(obj_pad1, obj_ball))
					state = STATE_END;
				else {
					var tmp_frictionfactor = C_FRICTION_FACTOR_PAD;
					vec2.subtract(tmp_padvector_fjhuawiehfaw, obj_pad1.position, obj_pad1.trackHistroy);
				}
				break;
			}
			tempv = -1;

		} else if (tmp_ballposition_fhuawiefjaw[i] < -boxSize[i] / boxSize[2] / 2 + C_ballSize) {
			switch(i) {
			case 0:
				knockOnGrid('-x', ball.position);
				break;
			case 1:
				knockOnGrid('-y', ball.position);
				break;
			case 2:
				if (!checkInPadfjawioejfawoief(obj_pad2, obj_ball))
					state = STATE_END;
				else {
					var tmp_frictionfactor = C_FRICTION_FACTOR_PAD;
					vec2.subtract(tmp_padvector_fjhuawiehfaw, obj_pad2.position, obj_pad2.trackHistroy);
				}
				break;
			}
			tempv = 1;
		}
		if (tempv) {

			var tmp_normalBounce_fjawiefjiwoeaf = [0, 0, 0];
			tmp_normalBounce_fjawiefjiwoeaf[i] = tempv;

			var tmp_speedSpin_fjiawoejfiowajefwaf = [0, 0, 0];
			//vec3.cross(tmp_speedSpin_fjiawoejfiowajefwaf, ballSpinVectorfawefweafaef, tmp_normalBounce_fjawiefjiwoeaf);
			//v_mul(tmp_speedSpin_fjiawoejfiowajefwaf, C_ballSize * ballSpinVectorfawefweafaef[3]);

			var tmp_normalSpeed = vec3.dot(ballSpeedVectorj8g9awjefwae, tmp_normalBounce_fjawiefjiwoeaf);
			var tmp_normalSpeedvector_fhuwiaehfwe = [];
			vec3.copy(tmp_normalSpeedvector_fhuwiaehfwe, tmp_normalBounce_fjawiefjiwoeaf);
			v_mul(tmp_normalSpeedvector_fhuwiaehfwe, tmp_normalSpeed);

			v_mul(tmp_padvector_fjhuawiehfaw, 1 / C_PAD_TRACK_HISTROY_SIZE);

			var tmp_tangentSpeed_fhuiawef = [];
			vec3.subtract(tmp_tangentSpeed_fhuiawef, ballSpeedVectorj8g9awjefwae, tmp_normalSpeedvector_fhuwiaehfwe);

			var tmp_friction_fjiawoejfiawoef = [];
			vec3.add(tmp_friction_fjiawoejfiawoef, tmp_tangentSpeed_fhuiawef, tmp_speedSpin_fjiawoejfiowajefwaf);
			vec3.subtract(tmp_friction_fjiawoejfiawoef, tmp_friction_fjiawoejfiawoef, tmp_padvector_fjhuawiehfaw);
			v_mul(tmp_friction_fjiawoejfiawoef, tmp_frictionfactor * tmp_normalSpeed);

			//vec3.add(ballSpinVectorfawefweafaef,ballSpinVectorfawefweafaef,tmp_speedSpin_fjiawoejfiowajefwaf);

			//	vec3.add(tmp_normalBounce_fjawiefjiwoeaf, tmp_normalBounce_fjawiefjiwoeaf, tmp_speedSpin_fjiawoejfiowajefwaf);
			//v_mul(tmp_normalBounce_fjawiefjiwoeaf,1);
			vec3.subtract(ballSpeedVectorj8g9awjefwae, ballSpeedVectorj8g9awjefwae, tmp_normalSpeedvector_fhuwiaehfwe);
			vec3.subtract(ballSpeedVectorj8g9awjefwae, ballSpeedVectorj8g9awjefwae, tmp_normalSpeedvector_fhuwiaehfwe);
			vec3.add(ballSpeedVectorj8g9awjefwae, ballSpeedVectorj8g9awjefwae, tmp_friction_fjiawoejfiawoef);

			var tmp_deltaSpinVector_fawefawef = [];
			vec3.cross(tmp_deltaSpinVector_fawefawef, tmp_friction_fjiawoejfiawoef, tmp_normalBounce_fjawiefjiwoeaf);
			v_mul(tmp_deltaSpinVector_fawefawef, C_SPIN_FACTOR);

			var tmp_SpinVector_fewafew = [];
			vec3.copy(tmp_SpinVector_fewafew, ballSpinVectorfawefweafaef);
			v_mul(tmp_SpinVector_fewafew, ballSpinVectorfawefweafaef[3]);
			vec3.add(tmp_SpinVector_fewafew, tmp_SpinVector_fewafew, tmp_deltaSpinVector_fawefawef);
			ballSpinVectorfawefweafaef[3] = vec3.length(tmp_SpinVector_fewafew);
			vec3.normalize(ballSpinVectorfawefweafaef, tmp_SpinVector_fewafew);


		}
	}
	if (vec2.length(ballSpeedVectorj8g9awjefwae) > 4 * Math.abs(ballSpeedVectorj8g9awjefwae[2]))
		ballSpeedVectorj8g9awjefwae[2] = vec2.length(ballSpeedVectorj8g9awjefwae) / 4;
	v_mul(ballSpeedVectorj8g9awjefwae, ballspeedLimitfjaiwoejfiweaf /vec3.length(ballSpeedVectorj8g9awjefwae));// Math.abs(ballSpeedVectorj8g9awjefwae[2]));

	//debugger
	//move
	vec3.copy(tmp_v3fawevsefasdcafsdfa, ballSpeedVectorj8g9awjefwae);
	v_mul(tmp_v3fawevsefasdcafsdfa, delta);
	vec3.add(ball.position, ball.position, tmp_v3fawevsefasdcafsdfa);

	//vec3.transformQuat(ballRotationfjw0oajwfioef, ballRotationfjw0oajwfioef, ballSpinVectorfawefweafaef) ;
	var out = [];
	//var t1 = [];
	//vec3.normalize(t1, ballSpinVectorfawefweafaef);
	phydic_movePad(obj_pad1, delta);
	phydic_movePad(obj_pad2, delta);
	return;
	quat.setAxisAngle(out, ballSpinVectorfawefweafaef, ballSpinVectorfawefweafaef[3]);
	quat.multiply(ballRotationfjw0oajwfioef, ballRotationfjw0oajwfioef, out);
	var quaternion = new THREE.Quaternion();
	quaternion.set(ballRotationfjw0oajwfioef[0], ballRotationfjw0oajwfioef[1], ballRotationfjw0oajwfioef[2], ballRotationfjw0oajwfioef[3]);
	ball.rotation.setFromQuaternion(quaternion);

	ball.position.x = ball.position[0];
	ball.position.y = ball.position[1];
	ball.position.z = ball.position[2];

	ballPointlight.position.copy(ball.position);
	crossLine.position.copy(ball.position);
	// ball.rotation.x += delta;
	// ball.rotation.y += delta / 2;
	// ball.rotation.x = ballRotationfjw0oajwfioef[0];
	// ball.rotation.y = ballRotationfjw0oajwfioef[1];
	// ball.rotation.z = ballRotationfjw0oajwfioef[2];
}

function checkInPadfjawioejfawoief(pad, ball) {
	for (var i = 0; i < 2; i++) {
		if (pad.position[i] + pad.size[i] < ball.position[i])
			return false;
		if (pad.position[i] - pad.size[i] > ball.position[i])
			return false;
	}
	return true;
}

function phydic_movePad(pad, delta) {
	var padMoveHistroy = pad.trackHistroy;
	var speedlimit = pad.speed;
	var dest = pad.destination;
	var padsize_fwaefaweffawijefiawefwe = pad.size;
	var pad = pad.position;

	if (padMoveHistroy.length > 2 * C_PAD_TRACK_HISTROY_SIZE / updateInterval) {
		padMoveHistroy.shift();
		padMoveHistroy.shift();
	}
	for (var i = 0; i < 2; i++)
		padMoveHistroy.push(pad[i]);
	var speedv = tmp_v3fawevsefasdcafsdfa;

	vec2.sub(speedv, dest, pad);
	var ds = speedlimit * delta / vec2.length(speedv);
	if (ds > 1)
		ds = 1;
	v_mul(speedv, ds);
	vec2.add(pad, pad, speedv);
	for (var i = 0; i < 2; i++) {
		var lx = boxSize[i] / boxSize[2] / 2 - padsize_fwaefaweffawijefiawefwe[i] / 2;
		pad[i] = pad[i] > lx ? lx : pad[i];
		pad[i] = pad[i] < -lx ? -lx : pad[i];
	}
}

function waitingForStartup(delta) {
	phydic_movePad(obj_pad1, delta);
	phydic_movePad(obj_pad2, delta);
	//	moveBallAlongPad();
	obj_ball.position[0] = 0;
	obj_ball.position[1] = -boxSize[1] / boxSize[2] / 2 + obj_ball.size;
	obj_ball.position[2] = 0;
}

var C_magnusFactor = 30;
var tmp_v3fawevsefasdcafsdfa = vec3.fromValues(0, 0, 0);
function magnus(delta, ball) {
	var C_ballSize = ball.size;
	vec3.cross(tmp_v3fawevsefasdcafsdfa, ballSpinVectorfawefweafaef, ballSpeedVectorj8g9awjefwae);
	v_mul(tmp_v3fawevsefasdcafsdfa, C_magnusFactor * C_ballSize * delta * ballSpinVectorfawefweafaef[3]);
	vec3.add(ballSpeedVectorj8g9awjefwae, tmp_v3fawevsefasdcafsdfa, ballSpeedVectorj8g9awjefwae);
//	v_mul(ballSpeedVectorj8g9awjefwae, ballspeedLimitfjaiwoejfiweaf / vec3.length(ballSpeedVectorj8g9awjefwae));

}