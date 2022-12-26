import { rolesDataSource } from "./Source";

it("using direct to viewmodel", async () => {
  // step 1 - hydrating the programmers model

  let rolesPm = rolesDataSource.map((roleDto) => roleDto.roleName);
  let usersPm = [];

  rolesDataSource.forEach((roleDto) => {
    roleDto.people.forEach((personDto) => {
      const newRoleName = roleDto.roleName;

      const newRole = {
        name: newRoleName,
        selected: true
      };
      const newUser = {
        name: personDto.name,
        roles: [newRole]
      };

      const find = usersPm.find((user) => user.name === personDto.name);
      if (!find) {
        usersPm.push(newUser);
      } else {
        const findRole = find.roles.find((role) => role.name === newRoleName);
        if (!findRole) {
          rolesPm.forEach((rolePm) => {
            if (rolePm === newRoleName) {
              find.roles.push(newRole);
            } else {
              find.roles.push({
                name: newRoleName,
                selected: false
              });
            }
          });
        }
      }
    });
  });

  console.log(usersPm);

  let activeUserPermissionsCount = 0;

  // step 2 - hydrating the ViewModel for users display
  const usersDisplayViewModel = usersPm.map((userPm) => {
    let string = "The user " + userPm.name + " is a ";
    const userActiveRoles = userPm.roles.filter((rolePm) => rolePm.selected);
    const rolesVm = userActiveRoles.map((rolePm) => rolePm.name);
    const roleString = rolesVm.toString().replace(",", " and ");

    activeUserPermissionsCount += userActiveRoles.length;
    return string + roleString;
  });

  expect(usersDisplayViewModel).toEqual([
    "The user rob is a Admin and Teacher",
    "The user alex is a Admin",
    "The user simon is a Teacher and Student",
    "The user jane is a Teacher and Student"
  ]);

  // step 3 - hydrating the ViewModel for stats display
  console.log(activeUserPermissionsCount);

  const statsViewModel = {
    userCount: usersPm.length,
    activeUserPermissionsCount: activeUserPermissionsCount
  };

  expect(statsViewModel).toEqual({
    userCount: 4,
    activeUserPermissionsCount: 7
  });
});
