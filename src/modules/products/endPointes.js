import systemRoles from "../../utils/systemRoles.js";
const endpointesRole={
    addProduct: [systemRoles.superAdmin, systemRoles.ADMIN]
}
export default endpointesRole