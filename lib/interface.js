'use strict';

/**
 * Creates a new interface definition.
 * @public
 * @constructor
 * @param {string} name The interface name
 * @param {Array.<Interface~MethodSignature>} [methodSignatures] The method signatures to be defined for the interface
 */
var Interface = function Interface(name, methodSignatures) {
  var iface = this;

  this.name = name;
  this.methods = [];

  if (methodSignatures) {
    methodSignatures.forEach(function(sig) {
      iface.defineMethod(sig.methodName, sig.argTypes, sig.retType);
    });
  }
};

Interface.prototype = {
  /**
   * Defines a new method.
   * @public
   * @param {string} methodName The method name
   * @param {string[]} argTypes The argument types
   * @param {string} retType The return type
   */
  defineMethod: function defineMethod(methodName, argTypes, retType) {
    this.methods.push({
      methodName: methodName,
      argTypes: argTypes,
      retType: retType
    });
  }
};

/**
 * Verifies that the given class implements all the methods defined in a set of interfaces.
 * @public
 * @static
 * @param {function} clazz The constructor of the prototype to verify
 * @param {Array.<Interface>} ifaces The interfaces to check the class against
 * @throws {Error} Throws if any method in the interfaces isn't implemented by the class.
 */
Interface.verifyImplementation = function verifyImplementation(clazz, ifaces) {
  ifaces.forEach(function(iface) {
    iface.methods.forEach(function(methodDef) {
      var classInProtoChain = clazz;
      while (classInProtoChain) {
        var propWithMethodName = classInProtoChain[methodDef.methodName];
        if (propWithMethodName) {
          if (typeof propWithMethodName === 'function') {
            return;
          }
          break;
        }
        classInProtoChain = classInProtoChain.prototype;
      }

      var clazzName = 'Class';
      if (clazz.name) {
        clazzName += ' "' + clazz.name + '"';
      }

      throw new Error('{} must implement method {}.{}({}) => {}'
          .replace('{}', clazzName)
          .replace('{}', iface.name)
          .replace('{}', methodDef.methodName)
          .replace('{}', methodDef.argTypes.join(', '))
          .replace('{}', methodDef.retType));
    });
  });
};

/**
 * The signature of an interface method.
 * @typedef {Object} Interface~MethodSignature
 * @property {string} methodName The method name
 * @property {string[]} argTypes The argument types
 * @property {string} retType The return type
 */

module.exports = Interface;
