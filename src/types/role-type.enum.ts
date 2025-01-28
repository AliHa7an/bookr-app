import { registerEnumType } from "@nestjs/graphql";

export enum USER_ROLE_ENUM {
  CUSTOMER = "customer",
  ADMIN = "admin",
  STAFF = "staff"
}


registerEnumType(USER_ROLE_ENUM, {
    name: "UserRoles"
})