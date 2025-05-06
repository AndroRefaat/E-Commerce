import { Args, Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "src/modules/order/order.service";
import { ListOrderFiltersDTO, OrderObject } from "../types/order.types";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleTypes } from "src/common/types/types";
import { UsePipes, ValidationPipe } from "@nestjs/common";





@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver()
export class OrderResolver {
    constructor(
        private readonly orderService: OrderService
    ) { }


    @Auth(RoleTypes.admin, RoleTypes.user)
    @Query(() => [OrderObject], { name: 'listOrders', description: 'get all orders' })
    async listOrders(
        @Args('listOrderFilters') listOrderFilters: ListOrderFiltersDTO,
    ) {
        return this.orderService.getOrders(listOrderFilters)
    }

}