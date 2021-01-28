import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
// eslint-disable-next-line prettier/prettier
class CatetoryRepository extends Repository<Category> { }

export default CatetoryRepository;
