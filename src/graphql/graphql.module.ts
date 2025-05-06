import { Module } from "@nestjs/common";
import { OrderResolver } from "./resolvers/order.resolver";
import { OrderModule } from "src/modules/order/order.module";


@Module({
    imports: [OrderModule],
    controllers: [],
    providers: [OrderResolver],
})
export class GQLModule { }