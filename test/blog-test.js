const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Api', function() {
	before(function() {
		return runServer();
	});

	after(function(){
		return closeServer();
	});

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

	it('should add an item on POST', function(){
		const newPost = {title: "Mind Games", author: "Suzie Q", content: "the key to the mind game is to never forget to ..." };
		return chai.request(app)
			.post('/blog')
			.send(newPost)
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('title', 'author', 'content', 'publishDate');
				res.body.id.should.not.be.null;
				res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
			});
	});

	it('should update items on PUT', function(){
		const updateData = {
			title: 'Cool stuff',
			author: 'Jam',
			content: 'Woah... It totally worked...!',
			publishDate: Date.now()
		};

		return chai.request(app)
			.get('/blog')
			.then(function(res) {
				updateData.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog/${updateData.id}`)
					.send(updateData);
			})
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.deep.equal(updateData);
			});
	});


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