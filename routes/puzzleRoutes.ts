import { Router } from "express";

import { Cache } from "../cache/index.ts";
import { PuzzleController } from "../controllers/PuzzleController.ts";
import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";
import { PuzzleService } from "../services/PuzzleService.ts";

const router = Router();

const cache = new Cache();
const puzzleRepository = new PuzzleRepository();
const puzzleService = new PuzzleService(puzzleRepository);
const puzzleController = new PuzzleController(puzzleService, cache);

router.post("/puzzles/search", puzzleController.searchPuzzles.bind(puzzleController));
router.get("/puzzles/:id", puzzleController.getPuzzleById.bind(puzzleController));

export default router;
