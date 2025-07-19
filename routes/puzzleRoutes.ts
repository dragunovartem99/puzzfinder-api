import { Router } from "express";

import { PuzzleController } from "../controllers/PuzzleController.ts";
import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";
import { PuzzleService } from "../services/PuzzleService.ts";

const router = Router();

const puzzleRepository = new PuzzleRepository();
const puzzleService = new PuzzleService(puzzleRepository);
const puzzleController = new PuzzleController(puzzleService);

router.post("/puzzles/search", puzzleController.searchPuzzles.bind(puzzleController));
router.get("/puzzles/:id", puzzleController.getPuzzleById.bind(puzzleController));

export default router;
