import songRoutes from './songs.js';
import uploadRoutes from './upload.js';
import settingsRoutes from './settings.js';
import serialRoutes from './serial.js';

const configRoutes = (app) => {
  app.use('/songs', songRoutes);
  app.use('/upload',uploadRoutes);
  app.use('/settings',settingsRoutes);
  app.use('/serial',serialRoutes);
  app.use('*', (req, res) => {
    return res.status(200).json({ status: "Connected" });
  });
};
  
export default configRoutes;