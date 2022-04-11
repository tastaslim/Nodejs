import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const {DATABASE_URL} = process.env;
const pgClient = new pg.Client(DATABASE_URL);
pgClient.connect();
class PgResource{
    constructor() { }

    async listMovies(directors){
        const query = `UPDATE pet.movies SET movie_name='John Wick' WHERE director_id in (${directors.join(',')})`;
        const result = await pgClient.query(query);
        return result.rows;
    }
    // async listBackupDefinitions() {
    //     const query = `SELECT * FROM migration.definitions`;
    //     const result = await pgClient.query(query);
    //     return result.rows;
    // }
    // async listConnections() {
    //     const query = `SELECT * FROM migration.connections`;
    //     const result = await pgClient.query(query);
    //     return result.rows;
    // }
    //
    // async getDefinition(definitionId) {
    //     const query = `SELECT * FROM migration.definitions WHERE id = ${definitionId}`;
    //     const result = await pgClient.query(query);
    //     return result.rows[0];
    // }
    //
    // async createConnection(connection) {
    //     const query = `INSERT INTO migration.connections (id,payload) VALUES (4,'${JSON.stringify(connection)}')`;
    //     const result = await pgClient.query(query);
    //     return result.rows[0];
    // }
}
// export default PgResource;
// import {PgResource} from './pg-service';
const pgResource = new PgResource();
// pgResource.getDefinition(1).then(result => console.log(result)).catch(err => console.log(err));
pgResource.listMovies(['9','20','13','12']).then((result) => {
    console.log(result);
    pgClient.end();
}).catch(err => console.log(err));
// pgResource.createConnection({name:"John",age:30}).then(result => console.log(result)).catch(err => console.log(err));