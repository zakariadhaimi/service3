const nodemailer = require('nodemailer');
const mariadb = require('mariadb');
const conn = mariadb.createPool({host: 'localhost', user: 'root', database: 'dcim_test', connectionLimit: 6});

// select id and oids name of equipment
let query = "SELECT e.name as name , a.message as message from alarms a join equipment e on e.id=a.equipment_id where a.end_time is  null";
// connect to database
setInterval(() => {

    conn.getConnection()
        .then(conn => {
            conn.query(query)
                .then(
                    //res = query result
                    (results) => {
                        conn.end();
                        let transporter = nodemailer.createTransport({
                            port: 587,
                            pool: true,
                            secure: true,
                            service: 'gmail',
                            auth: {
                                user: 'mailer.service.n.p.1@gmail.com',
                                pass: 'N+ONE/*19'
                            }
                        });
                        results.forEach(
                            (result) => {
                                let mailOptions = {
                                    from: 'mailer.service.n.p.1@gmail.com',
                                    to: ['zakariadhaimi@gmail.com ',


                                    ],
                                    subject: result.name + 'Alert',
                                    text: result.message
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                        //transporter.close();
                                    }
                                })
                            }
                        )
                    })
        })
}, 5000);



