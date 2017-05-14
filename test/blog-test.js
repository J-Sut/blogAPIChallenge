const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {Blog} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogData(){
	console.info('seeding blog data');
	const seedData = [];

	for (let i=1; i<+10; i++){
		seedData.push(generateBlogData());
	}
	return Blog.insertMany(seedData);
}; 

function generateBlogData() {

	return {
		title: faker.lorem.words(),
		content: faker.lorem.paragraph(),
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		}
	}
};

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
};

describe('Blog Api', function() {
	
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedBlogData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function(){
		return closeServer();
	});

	describe('GET endpoint', function() {

		it('should list items on GET', function() {
			return chai.request(app)
			.get('/blog/posts')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.an('array');

				res.body.length.should.be.at.least(1);

				const expectedKeys = ['title', 'author', 'content'];
				res.body.forEach(function(item){
					item.should.be.an('object');
					item.should.include.keys(expectedKeys);
				});
			});
		});
	});

	describe('POST endpoint', function() {
	
		it('should add a new post on POST', function() {
	
			const newPost = generateBlogData();
			return chai.request(app)
				.post('/blog/posts')
				.send(newPost)
				.then(function(res){
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.include.keys('title', 'author', 'content', 'id');
					res.body.id.should.not.be.null;
					res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
				});
		});		
	});

	describe('PUT endpoint', function() {
		
		it('should update the blog on PUT', function(){
		    const updateData = {
		      // id: faker.random.uuid(),
		      title: 'foo',
		      content: 'good stuff, very well written',
		      author: {
		      	firstName: 'some',
		      	lastName: 'guy'
		      }
		    };		


		    // ************ Problem: I think the object is updating correctly 
		    // but I think the response is returning the item prior to the update
		    // because that's what seemed to be happening when I made the put endpoint
	
		    return Blog
		    	.findOne()
		    	.exec()
		    	.then(function(post) {
		    		updateData.id = post.id;
		    		return chai.request(app)
		    			.put(`/blog/posts/${updateData.id}`)
		    			.send(updateData);
		    	})
		    	// .findById(`${updateData.id}`, function(err, res) {
		    	// 	return res
		    	// })
		    	.then(function(res){
		    		res.should.have.status(200);
		    		res.should.be.json;
		    		res.body.should.be.a('object');
		    		res.body.should.deep.equal(updateData)
		    	});
		});
	}); 
	
	describe('DELETE endpoint', function() {	
	
		it('should delete items on DELETE', function(){
			return chai.request(app)
				.get('/blog/posts')
				.then(function(res){
					return chai.request(app)
						.delete(`/blog/posts/${res.body[0].id}`);
				})
				.then(function(res){
					res.should.have.status(204);
				});
		});
	});
});