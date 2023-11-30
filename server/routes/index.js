const configRoutes = (app) => {
    app.use('*', (req, res) => {
      res.sendStatus(404);
    });
  };
  
export default configRoutes;