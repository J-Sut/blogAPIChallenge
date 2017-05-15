exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://blogApiJam:NPf6vxX7z52ytNHD@ds143191.mlab.com:43191/thinkful-blog-api';
                      
exports.TEST_DATABASE_URL = (
						process.env.TEST_DATABASE_URL ||
						'mongodb://localhost/test-blog-app');  

exports.PORT = process.env.PORT || 8080;