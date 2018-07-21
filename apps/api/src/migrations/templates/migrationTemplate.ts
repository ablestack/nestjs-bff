//
// Migration file template
// 1 - Remove this top section
// 2 - Uncomment the rest of the file
// 3 - Customize for your use case
//

// Required imports
// import { Connection } from 'mongoose';
// import { LoggerService } from '../../src/common/services/logger.service';
// import { CatSchema } from '../../src/<Model>/schemas/cat.schema';
// import { data } from '../seeddata/<seed-data-filename>';

/**
 * Add custom imports here
 */
// import { CatSchema } from '../../../Cats/schemas/Cat.schema'; // Import model schema as needed
// import { data } from '../seeddata/seed-data-dev'; // Import seed data as needed

/**
 * Make any changes you need to make to the database here
 */
// export async function up(connection: Connection, loggerService: LoggerService) {
// const new<Model>s = data.entities;
// const <Model> = connection.model('<Model>', <Model>Schema);
// const completed = await <Model>.collection.insertMany(new<Model>s);
// loggerService.log(`UP script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
// }

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
// export async function down(connection: Connection, loggerService: LoggerService) {
// const new<Model>s = data.entities;
// const idsToRemove = new<Model>s.map(item => item._id);
// const <Model> = connection.model('<Model>', <Model>Schema);
// const completed = await <Model>.collection.deleteMany({ _id: { $in: idsToRemove } });
// loggerService.log(`DOWN script completed. ${completed ? JSON.stringify(completed.result) : 'no results'}`);
// }
