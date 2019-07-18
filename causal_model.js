#! /usr/bin/node

/*
   1. If an object is pushed off the table, it will have nothing beneath it
   2. If an object has nothing beneath it, it will fall
   3. If an object falls and is brittle, it breaks. Else, it will bounce up and come to rest.
 */

function tableRule(object) {
	if(object.get('justPushedOff')){
		object.set('surfaceBeneath', false);
		object.set('justPushedOff', false);
		console.log('The object doesn\'t have a surface beneath it');
	}
}

function surfaceRule(object) {
	if(object.get('surfaceBeneath') === false){
		object.set('falling', true);
		console.log('The object is now falling');
	}
}

function hittingGroundRule(object) {
	if(object.get('falling')){
		if(object.get('isBrittle')){
			object.set('shatter', true);
			object.set('surfaceBeneath', true);
			console.log('The object has now shattered');
		} else {
			object.set('bounce', true);
			console.log('The object is now bouncing');
		}
		object.set('falling', false);
	}
}

function RuleSet(...rules){
	this.rules = rules;
	this.eval = function(obj){
		do {
			console.log('evaluating');
			this.rules.forEach( x => {
					x(obj);
					});
		}while(obj.isChanging());
	}
}

function CausalObject(){
	this.properties = {};
	this.flux = false;
	this.set = function(property, value){
		oldVal = this.properties[property];
		if(value != oldVal){
			this.properties[property] = value;
			this.flux = true;
		}
	}
	this.get = function(property){
		return this.properties[property];
	}
	this.isChanging = function(){
		result = this.flux;
		this.flux = false;
		return result;
	}
}

const obj = new CausalObject();
const ruleSet = new RuleSet(
		tableRule,
		surfaceRule,
		hittingGroundRule
);

obj.set('isBrittle', true);
obj.set('justPushedOff', true);
ruleSet.eval(obj);
console.log('Final state of object');
console.log(obj.properties);

/* Moral of the story - Causal models can be represented as state machines. Or rather, state machines are one examples of causal models. Are they the only type of causal models? I don't know for now. */
