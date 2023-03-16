// exports.getUserShoppingCart = (req,res)=>{
//     const customer_id = req.user[0].id;
//     const shopping_cart = 'bookstore.shopping_cart'
//     // const cart_id = db.select('cart_id').from('bookstore.shopping_cart_item').join('bookstore.shopping_cart',function (){
//     //     this.on('bookstore.shopping_cart.id','=','bookstore.shopping_cart_item.cart_id')
//     // }).where('bookstore.shopping_cart.customer_id','=',customer_id).distinct()
//     //
//     // db.select('bookstore.books.id','isbn','bookstore.authors.first_name','bookstore.authors.last_name','title','publication_year','selling_price','image','bookstore.shopping_cart_item.quantity','bookstore.shopping_cart_item.price','bookstore.shopping_cart_item.total_price')
//     //     .from('bookstore.books').join('bookstore.authors',function (){
//     //         this.on('bookstore.authors.id','=','books.author_id')
//     // }).join('bookstore.shopping_cart_item',function(){
//     //     this.on('bookstore.shopping_cart_item.book_id','=','books.id')
//     // })
//     //     .whereIn('bookstore.books.id',function(){
//     //         this.select('book_id').from('bookstore.shopping_cart_item')
//     //         .leftJoin(shopping_cart,function (){
//     //             this.on(`bookstore.shopping_cart_item.cart_id`,'=',`${shopping_cart}.id`)
//     //         }).where(`${shopping_cart}.customer_id`,'=',customer_id)
//     //     }).andWhere('bookstore.shopping_cart_item.cart_id','=',cart_id)
//     //     .then(data=>{data.length ? res.json(data) : res.status(200).json({message:'You have no books in your cart'})})
//     //     .catch(err=>res.status(500).json(err))
//
//
//
//
//
// }






const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');


passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.create({ email, password });

                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);










