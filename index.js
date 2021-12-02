const types = {
	['Edm.Boolean']: {
		update(schema, property) {
			schema[property] = {
				type: ['boolean', 'null']
			};
		}
	},

	['Edm.Int32']: {
		update(schema, property) {
			schema[property] = {
				type: ['number', 'null']
			};
		}
	},

	['Edm.Int64']: {
		update(schema, property) {
			schema[property] = {
				type: ['number', 'null']
			};
		}
	},

	['Edm.Decimal']: {
		update(schema, property) {
			schema[property] = {
				type: ['number', 'null']
			};
		}
	},

	['Edm.String']: {
		update(schema, property) {
			schema[property] = {
				type: ['string', 'null'],
				pattern: '^[^<>]*$'
			};
		}
	},

	['Edm.DateTimeOffset']: {
		update(schema, property) {
			schema[property] = {
				type: ['string', 'null'],
				format: 'date-time'
			};
		}
	},

	['Edm.Date']: {
		update(schema, property) {
			schema[property] = {
				type: ['string', 'null'],
				format: 'date'
			};
		}
	}
};

function setArrayType(schema, property) {
	schema[property] = {
		type: ['array', 'null'],
		items: schema[property]
	};
}

function setObjectType(schema, property, metadata, propertyObject) {
	schema[property] = {
		type: ['object', 'null'],
		additionalProperties: false,
		properties: generateProperties(metadata, propertyObject.$Type)
	};
}

function generateProperties(metadata, entityType) {
	const entityObject = metadata['ca.toronto.api.dataaccess.odata4'][entityType.replace('ca.toronto.api.dataaccess.odata4.', '')];

	if (entityObject) {
		return Object.keys(entityObject).filter((property) => property.indexOf('$') !== 0).reduce((acc, cur) => {
			const propertyObject = entityObject[cur];

			if (types[propertyObject.$Type]) {
				types[propertyObject.$Type].update(acc, cur);
			} else if (propertyObject.$Type.indexOf('ca.toronto.api.dataaccess.odata4.') !== -1) {
				setObjectType(acc, cur, metadata, propertyObject);
			} else {
				acc[cur] = {};
			}

			if (propertyObject.$Collection) {
				setArrayType(acc, cur);
			}

			return acc;
		}, {});
	}

	return {};
}

/**
 * Generate a JSON Schema from oData metadata.
 * @param {(string|object)} metadata oData metadata
 * @param {string} entitySet oData entity set name
 * @returns {object} JSON Schema
 */
module.exports = function (metadata, entitySet) {
	if (typeof metadata === 'string') {
		metadata = JSON.parse(metadata);
	}

	return {
		$schema: 'http://json-schema.org/draft-04/schema#',
		id: '/',
		type: 'object',
		additionalProperties: false,
		properties: generateProperties(metadata, metadata['ca.toronto.api.dataaccess.odata4'].DataAccessContainer[entitySet].$Type)
	};
};
