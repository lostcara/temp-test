import hasRole from './permission/hasRole';
import hasPermi from './permission/hasPermi';

const directive = (app: any) => {
  app.directive('hasRole', hasRole);
  app.directive('hasPermi', hasPermi);
};

export default directive;
