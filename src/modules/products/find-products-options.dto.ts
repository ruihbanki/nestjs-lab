import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Product } from './product.entity';
import { ProductsArgs } from './products.args';

export class FindProductsOptions extends ProductsArgs {
  relations?: FindOptionsRelations<Product>;
  select?: FindOptionsSelect<Product>;
}
