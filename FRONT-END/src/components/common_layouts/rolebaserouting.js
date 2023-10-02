import React from 'react';
import { Route } from 'react-router-dom';
import { grantPermission } from '../../_services/common.service';
import UnauthorizedComponent from '../common_layouts/unauthorized';

export default function RoleBasedRouting({component: Component, roles, ...rest}) {
    return (<>
        { grantPermission(roles) && (
            <Route {...rest} />
        )}
        {
          !grantPermission(roles) && (
            <Route><UnauthorizedComponent /></Route>
          )
        }
      </>
    );
}