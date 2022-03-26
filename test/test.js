const app = require('../app');
const request= require('supertest');

describe('Signup/Signin', ()=>{

    // I had to set authorization key, i don't think one can get token from jest.js
    let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsbmFtZSI6IlJhcWVlYiB0YWl3byIsImVtYWlsIjoidGFpd29yb3FlZWJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImlkIjoiX2JuS3B2Q0thUyIsImlhdCI6MTY0NzgxNTYwMSwiZXhwIjoxNjQ3OTAyMDAxfQ.D0XFMz6zOuhX8Mm6jE0pQoF6EQUO5P0_Wc70PFBmn60'

    test('should create an new user account', (done) =>{
        jest.setTimeout(30000);
        request(app)
            .post('/register')
            .send({
                fullname: "admin test",
                username: "admin-test",
                email: "admin-test@gmail.com",
                password: "testingAdmin12345",
                pin: "1234"
            })
            .expect(201)
            .expect((res) => {
                res.body.message = "user Account created successfully";
                res.body.status = true;
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    test('should log in the user account', (done) => {
        jest.setTimeout(3000);
        request(app)
            .post('/login')
            .send({
                username: "admin-test",
                password: "testingAdmin12345",
            })
            .expect(200)
            .expect((res) => {
                res.body.fullname = "admin test";
                res.body.username = "admin-test";
                res.body.status = "successfully logged in";
                res.body.success = true;
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    test('should fund account', (done) => {
        jest.setTimeout(3000);
        request(app)
            .post('/user/fund')
            .set('Authorization', token)
            .send({
                amount: 20000,
                pin: "1234"
            })
            .expect(200)
            .expect((res) => {
                res.body = "admin account funded";
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });

    });

    test('should transfer fund to another user', (done) => {
        jest.setTimeout(3000);
        request(app)
            .post('/user/transfer')
            .set('Authorization', token)
            .send({
                amount: 500,
                receiver: "admin-test",
                pin: "1234"
            })
            .expect(202)
            .expect((res) => {
                res.body = "Funds Transfered to admin-test successfully"
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });

    });

    test('should withdraw fund', (done) => {
        jest.setTimeout(3000);
        request(app)
            .post('/user/withdraw')
            .set('Authorization', token)
            .send({
                amount: 500,
                bank: "vfd bank",
                account_no: "2314543456",
                pin: "1234"
            })
            .expect(200)
            .expect((res) => {
                res.body = "Transaction Successful"
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    test('should delete the admin-test account', (done) => {
        jest.setTimeout(3000);
        request(app)
            .delete('/user/deletetest')
            .set('Authorization', token)
            .send({
               username: "admin-test",
            })
            .expect(200)
            .expect((res) => {
                res.body = "user admin-test account deleted successfully"
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

})