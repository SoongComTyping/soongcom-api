const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');


const { sequelize } = require('./models');

//.env파일을 읽어서 process.env로 만든다.
//여러 비밀 키들을 .env에 저장하여 꺼내서 사용 
dotenv.config();
//라우터 선언 
const mainRouter = require('./routes');

const app = express();

//실행될 포트 지정
//배포 실행 시 3000번, 개발 모드 진입 시 3001번
app.set('port', process.env.PORT || 3000);

sequelize.sync({ force: false })
.then(() => {
        console.log('Mysql DB 연결 성공');
})
.catch((err) => {
        console.log(err);
});

//morgan은 서버로 들어온 요청과 응답을 기록해줌
//dev, tiny, short등 여러가지 모드가 있다,
//개발 모드와 배포 모드를 분기 시킴
if(process.env.NODE_ENV === 'production'){
        console.log("배포 모드입니다.");
        app.use(morgan('combined'));
}else{
        console.log("개발 모드 입니다.");
        app.use(morgan('dev'));
}

//서버 내에 정적 경로 설정
app.use(express.static(path.join(__dirname, 'public')));
//이미지 소스 정적 경로 설정
//라우터 이름과 실제 경로 이름을 구분하여 보안성 향상

//json 타입의 요청이 들어왔을때 해석해준다.
app.use(express.json());
//객체 형태 데이터의 중첩을 허용하지 않는다. 
app.use(express.urlencoded({ extended : false}));

//추후 로그인 기능 구현을 위한 passport 선언 -> 안쓰일수도 있다
//app.use(passport.initialize());
//app.use(passport.session());

//main 라우터 경로 연결
app.use('/', mainRouter);


//라우터로 지정되지 않은 경로가 들어왔을떄
app.use((req, res, next) => {
        res.status(404).send('404 NOT FOUND');
});

//에러처리 미들웨어
app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
        res.status(err.status || 500);
        console.error(err);
        //에러에 따라 http상태 코드 지정
        res.render('error');
});

//서버가 실행될 포트 지정
app.listen(app.get('port'), () => {
        console.log(app.get('port'), '번 포트에서 대기중');
});
