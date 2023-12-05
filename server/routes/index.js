import songRoutes from './songs.js';
import uploadRoutes from './upload.js';

const configRoutes = (app) => {
  app.use('/songs', songRoutes);
  app.use('/upload',uploadRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};
  
export default configRoutes;