const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {Blog} = require('../models');
const {TEST_DATABASE_URL} = require('../blogRouter');

chai.use(chaiHttp);

function seedBlogData(){
	console.info('seeding blog data');
	const seedData = [];

	for (let i=1; i<+10; i++){
		seedData.push(generateBlogData());
	}
	return Blog.insertMany(seedData);
}; 

var randomWord = faker.lorem.words();
console.log(randomWord);

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
			.get('/blog')
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
				.post('/blog')
				.send(newPost)
				.then(function(res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.include.keys('title', 'author', 'content', 'publishDate');
					res.body.id.should.not.be.null;
					res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate:res.body.publishDate}));
				});
		});		
	});

	describe('PUT endpoint', function() {

		it('should update the blog on PUT', function(){
		    const updateData = {
		      title: 'foo',
		      author: 'some guy',
		      content: 'good stuff, very well written',
		      publishDate: Date.now()
		    };		

		    return chai.request(app)
		    	.get('/blog')
		    	.then(function(post) {
		    		updateData.id = post.body[0].id;
		    		return chai.request(app)
		    			.put(`/blog/${updateData.id}`)
		    			.send(updateData);
		    	})
		    	.then(function(res){
		    		res.should.have.status(201);
		    		res.should.be.json;
		    		res.body.should.be.a('object');
		    		res.body.should.deep.equal(updateData)
		    	});
		});
	});

	describe('DELETE endpoint', function() {

		it('should delete items on DELETE', function(){
			return chai.request(app)
				.get('/blog')
				.then(function(res){
					return chai.request(app)
						.delete(`/blog/${res.body[0].id}`);
				})
				.then(function(res){
					res.should.have.status(204);
				});
		});
	});


});