import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Product } from './product.entity';

export class FindProductOptions {
  relations?: FindOptionsRelations<Product>;
  select?: FindOptionsSelect<Product>;
}
